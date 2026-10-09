import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as sib from "@getbrevo/brevo";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer } from "ws";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Site Context for AI
  const SITE_CONTEXT = `
    Jackson Multifacet is a modern digital solutions and business support company.
    Founded: March 3, 2023.
    Part of: Real Value & Stakes Limited.
    Core Philosophy: "Simply Extraordinary".
    Mission: To empower businesses with innovative digital solutions and strategic support.
    Services:
    1. Digital Product Development: Engineering scalable ecosystems and digital solutions.
    2. Branding & Creative Design: Crafting distinctive visual identities.
    3. Marketing & Growth: Data-driven strategies for acquisition and retention.
    4. Business Startup Support: Strategic advisory and infrastructure for founders.
    5. IT Support & Training: Maximizing technology effectiveness through guidance.
    6. Recruitment Solutions: Strategic talent support and hiring processes.
    Core Values: Excellence, Innovation, Integrity, Growth, Collaboration, Simplicity.
    Contact: jacksonmultifacet@mail.com (Primary Channel), +2348050221419 (Support).
  `;

  // API Route for Auth Login
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    
    if (email && email.includes("@")) {
      let role = 'client';
      if (email.startsWith('admin')) role = 'admin';
      else if (email.startsWith('staff')) role = 'staff';
      else if (email.startsWith('candidate')) role = 'candidate';
      else if (email.startsWith('client')) role = 'client';

      res.json({ id: `user-${role}-1`, email, role, name: email.split('@')[0] });
    } else {
      res.status(401).json({ error: "Invalid credential ID. Must be an email." });
    }
  });

const state = {
  projects: [
    { id: '1', name: 'Alpha Redesign', clientId: 'c1', status: 'active', progress: 85, description: 'Complete brand overhaul and digital infrastructure deployment.' },
    { id: '2', name: 'Beta API Integration', clientId: 'c2', status: 'planning', progress: 15, description: 'System-to-system integration for enterprise client.' },
    { id: '3', name: 'Gamma Growth Campaign', clientId: 'c3', status: 'active', progress: 42, description: 'Q3 acquisition strategy and continuous market analysis.' }
  ],
  messages: [
    { id: '1', sender: 'agency', text: "Welcome to the Jackson Multifacet talent network. Your onboarding portal is now active.", time: '09:00 AM' }
  ],
  candidates: [] as any[]
};

// API Route for Projects
app.get("/api/projects", (req, res) => {
  res.json(state.projects);
});

app.post("/api/projects", (req, res) => {
  const newProject = {
    id: Date.now().toString(),
    progress: 0,
    status: 'planning',
    ...req.body
  };
  state.projects.push(newProject);
  res.json(newProject);
});

app.patch("/api/projects/:id", (req, res) => {
  const index = state.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    state.projects[index] = { ...state.projects[index], ...req.body };
    res.json(state.projects[index]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// API Route for Messages
app.get("/api/messages", (req, res) => {
  res.json(state.messages);
});

app.post("/api/messages", (req, res) => {
  const newMsg = {
    id: Date.now().toString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...req.body
  };
  state.messages.push(newMsg);
  res.json(newMsg);
});

// API Route for Candidates Registration
app.get("/api/candidates", (req, res) => {
  res.json(state.candidates);
});

app.post("/api/candidates/register", (req, res) => {
  const newCandidate = {
    id: Date.now().toString(),
    registeredAt: new Date().toISOString(),
    status: 'pending_review',
    ...req.body
  };
  state.candidates.push(newCandidate);
  
  // Optionally log the receipt
  console.log(`New Candidate Registered: ${newCandidate.surname} ${newCandidate.firstName}`);
  
  res.json({ success: true, candidateId: newCandidate.id });
});

  // API Route for AI Chat
  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the Jackson Multifacet AI Assistant. 
          Use the following context to answer user questions about the company and its services. 
          Be professional, concise, and helpful. 
          If you don't know the answer based on the context, politely suggest they use the contact form.
          
          SITE CONTEXT:
          ${SITE_CONTEXT}`,
        },
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "AI communication failure." });
    }
  });

  // API Route for AI Strategy
  app.post("/api/ai/strategy", async (req, res) => {
    const { prompt } = req.body;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are the Jackson Multifacet Director of Strategy. 
          Respond to requests for digital strategies, growth plans, or business advice with actionable, structured plans in Markdown format.
          Ensure that it is professional and fits a modern digital solutions company.
          
          SITE CONTEXT:
          ${SITE_CONTEXT}`,
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "AI strategy generation failure." });
    }
  });

  // Initialize Brevo client
  let apiInstance: any = null;
  const getBrevoApi = () => {
    if (!apiInstance) {
      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        console.warn("BREVO_API_KEY is not set. Emails will only be logged to console.");
        return null;
      }
      const client = (sib as any).ApiClient.instance;
      const apiKeyAuth = client.authentications['api-key'];
      apiKeyAuth.apiKey = apiKey;
      apiInstance = new (sib as any).TransactionalEmailsApi();
    }
    return apiInstance;
  };

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    
    console.log("-----------------------------------------");
    console.log("NEW CONTACT FORM SUBMISSION");
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log("-----------------------------------------");

    const brevo = getBrevoApi();
    const receiver = process.env.CONTACT_RECEIVER_EMAIL;

    if (brevo && receiver) {
      try {
        const sendSmtpEmail = new (sib as any).SendSmtpEmail();
        sendSmtpEmail.subject = `Jackson Multifacet: New Contact from ${name}`;
        sendSmtpEmail.htmlContent = `
          <html>
            <body style="font-family: sans-serif; background-color: #050507; color: #e0e0e6; padding: 40px;">
              <h2 style="color: #6366f1;">New Transmission Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p style="font-size: 10px; color: rgba(255,255,255,0.2); margin-top: 40px; text-transform: uppercase; letter-spacing: 2px;">Jackson Multifacet Core System</p>
            </body>
          </html>
        `;
        sendSmtpEmail.sender = { name: "Jackson Multifacet Web", email: "noreply@jacksonmultifacet.com" };
        sendSmtpEmail.to = [{ email: receiver }];
        sendSmtpEmail.replyTo = { name: name as string, email: email as string };

        await brevo.sendTransacEmail(sendSmtpEmail);
        console.log("Brevo: Email sent successfully.");
      } catch (error) {
        console.error("Brevo Error:", error);
        // We still respond success to the user so we don't break the UI, 
        // but log the error on server.
      }
    }

    res.json({ 
      status: "success", 
      message: "Signal received and logged to system core." 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    ws.on('message', (message) => {
      // Echo the message back to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(message.toString());
        }
      });
    });
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
}

startServer();
