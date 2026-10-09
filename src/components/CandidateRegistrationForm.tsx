import { useState, useRef } from 'react';
import { Upload, ChevronRight, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { supabase, hasSupabase } from '../supabase';
import { usePaystackPayment } from 'react-paystack';
import { useToast } from './Toast';

export default function CandidateRegistrationForm({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const { toast, success, error } = useToast();

  const passportInputRef = useRef<HTMLInputElement>(null);
  const g1InputRef = useRef<HTMLInputElement>(null);
  const g2InputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Step 2: Personal Details
    surname: '',
    firstName: '',
    otherName: '',
    address: '',
    dob: '',
    sex: '',
    nationality: '',
    stateOfOrigin: '',
    lga: '',
    religion: '',
    telephone: '',
    email: '',
    whatsApp: '',
    maritalStatus: '',
    educationLevel: '',
    handicap: 'NO',
    handicapChallenge: '',
    validIdNumber: '',
    idType: '',
    passportUrl: '',

    // Step 3: Next of Kin
    nokSurname: '',
    nokFirstName: '',
    nokOtherName: '',
    nokAddress: '',
    nokTelephone: '',
    nokEmail: '',
    nokWhatsApp: '',
    nokRelationship: '',

    // Step 3: Employment Details
    desiredPosition1: '',
    desiredPosition2: '',
    desiredPosition3: '',
    jobLocation1: '',
    jobLocation2: '',
    jobLocation3: '',
    jobMode: '',
    yearsOfExperience: '',

    // Step 4: Guarantor 1 Details
    g1Surname: '',
    g1FirstName: '',
    g1OtherName: '',
    g1Address: '',
    g1Telephone: '',
    g1Email: '',
    g1Dob: '',
    g1Sex: '',
    g1Relationship: '',
    g1Occupation: '',
    g1WorkAddress: '',
    g1KnownDuration: '',
    g1WhatsApp: '',
    g1FileUrl: '',

    // Step 5: Guarantor 2 Details
    g2Surname: '',
    g2FirstName: '',
    g2OtherName: '',
    g2Address: '',
    g2Telephone: '',
    g2Email: '',
    g2Dob: '',
    g2Sex: '',
    g2Relationship: '',
    g2Occupation: '',
    g2WorkAddress: '',
    g2KnownDuration: '',
    g2WhatsApp: '',
    g2FileUrl: '',

    // Step 6: 10 Acquaintances
    acquaintances: Array.from({ length: 10 }, () => ({ surname: '', firstName: '', otherName: '' }))
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAcquaintanceChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const nextAcq = [...prev.acquaintances];
      nextAcq[index] = { ...nextAcq[index], [field]: value };
      return { ...prev, acquaintances: nextAcq };
    });
  };

  const processFile = async (file: File, fieldName: 'passportUrl' | 'g1FileUrl' | 'g2FileUrl') => {
    setUploadingField(fieldName);
    try {
      if (hasSupabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('candidate-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('candidate-files')
          .getPublicUrl(fileName);

        setFormData(prev => ({ ...prev, [fieldName]: publicUrl }));
      } else {
        const mockUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, [fieldName]: mockUrl }));
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      error('Upload failed: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passportUrl' | 'g1FileUrl' | 'g2FileUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, fieldName);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, fieldName: 'passportUrl' | 'g1FileUrl' | 'g2FileUrl') => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file, fieldName);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const amountKobo = formData.educationLevel === 'GRADUATE' ? 10000 * 100 : 5000 * 100;
  
  const paymentConfig = {
    reference: `cand_${new Date().getTime().toString()}`,
    email: formData.email || 'candidate@jackson.com',
    amount: amountKobo, // 100 kobo = 1 naira
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  };
  const initializePayment = usePaystackPayment(paymentConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 7) {
      if (step === 2 && !formData.educationLevel) {
        error("Please select your education level");
        return;
      }
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      let newCandidateId = '';
      try {
        if (hasSupabase) {
          const fullName = `${formData.firstName} ${formData.surname}`.trim();
          const { data } = await supabase.from('candidates').insert([{
            status: 'draft',
            agreed,
            full_name: fullName || 'New Registered Candidate',
            email: formData.email || null,
            role: formData.desiredPosition1 || 'Candidate',
            raw_data: formData
          }]).select();
          
          if (data && data.length > 0) {
            newCandidateId = data[0].id;
          }
        }
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      
      // Trigger paystack popup
      initializePayment({
        onSuccess: async (reference: any) => {
          if (hasSupabase && newCandidateId) {
            await supabase.from('candidates').update({ status: 'pending_review' }).eq('id', newCandidateId);
            await supabase.from('payments').insert([{
              user_id: null,
              amount: amountKobo / 100,
              reference: reference.reference || paymentConfig.reference,
              status: 'success',
              purpose: 'Candidate Registration',
              metadata: { candidate_id: newCandidateId }
            }]);
          }
          success("Registration and payment successful!");
          onComplete();
        },
        onClose: () => {
          toast('Payment was cancelled. Your registration has been saved as a draft.', 'info');
          onComplete();
        }
      });
    }
  };

  return (
    <div className="flex-1 bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative z-10 w-full mb-8">
      <div className="p-6 md:p-8 border-b border-emerald-500/20 bg-emerald-500/5">
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-widest flex items-center gap-3">
          <FileText className="w-6 h-6 text-emerald-400" /> Candidate Registration Form 2026
        </h2>
        <p className="text-xs text-white/40 mt-2 font-medium tracking-wide">
          Step {step} of 7 • Please complete all required information accurately.
        </p>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-10">
          
          {/* STEP 1: TERMS AND CONDITIONS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Terms and Conditions</h3>
              
              <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                <p>By completing and submitting this form, the Applicant agrees to the following:</p>
                
                <div className="space-y-2">
                  <strong className="text-white">1. Registration Fee</strong>
                  <p>The registration fee is N5,000 for non-graduates and N10,000 for graduates. This fee is non-refundable.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">2. Agency Service Charge</strong>
                  <p>Jackson Multifacet is entitled to 50% of the first full month's salary (30 days) for every job placement. This charge applies only to the first month. All future salaries belong fully to the Applicant.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">3. New Job Placements</strong>
                  <p>Each new job placement attracts a fresh 50% charge of the first month's salary, regardless of past placements.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">4. Early Exit from Job</strong>
                  <p>If an Applicant leaves a job before completing one month, Jackson Multifacet shall receive 50% of the total earnings for the days worked.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">5. Salary Payment Method</strong>
                  <p>All first-month salaries or earnings must be paid directly to Jackson Multifacet via the official account.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">6. Accuracy of Information</strong>
                  <p>All information provided must be true and correct. Any false information or forgery will attract legal action. Information provided will be used strictly for job placement. Jackson Multifacet is not responsible for errors in information supplied by the Applicant.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">7. Applicant Conduct & Liability</strong>
                  <p>Jackson Multifacet will not be held liable for any misconduct by an Applicant, including theft, fraud, property damage, injury, or death.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">8. Abscondment & Harassment</strong>
                  <p>Leaving a job without prior notice to the employer and/or Jackson Multifacet will result in legal action and blacklisting.</p>
                  <p>Harassment of Jackson Multifacet staff or any false accusation or labelling of Jackson Multifacet as a scam on any platform will attract legal consequences.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">Placement Outcome</strong>
                  <p>Failure to secure a job after an interview does not guarantee placement or refund. Disruptive behaviour may lead to blacklisting.</p>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-white">Authorized Registration Only</strong>
                  <p>Registration is valid only when done through official Jackson Multifacet staff. The Agency is not responsible for unauthorized transactions.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setAgreed(!agreed)}>
                <div className={`w-6 h-6 rounded border ${agreed ? 'bg-emerald-500 border-emerald-500 flex items-center justify-center' : 'border-white/30'}`}>
                  {agreed && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Declaration</h4>
                  <p className="text-xs text-white/50">I confirm that I have read, understood, and agreed to all the terms above.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Surname</label>
                  <input required value={formData.surname} onChange={(e) => handleInputChange('surname', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">First Name</label>
                  <input required value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Other Name</label>
                  <input value={formData.otherName} onChange={(e) => handleInputChange('otherName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Address</label>
                  <input required value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">DOB (DD | MM | YYYY)</label>
                  <input type="date" required value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Sex</label>
                  <select required value={formData.sex} onChange={(e) => handleInputChange('sex', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Nationality</label>
                  <input required value={formData.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">State of Origin</label>
                  <input required value={formData.stateOfOrigin} onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">L.G.A</label>
                  <input required value={formData.lga} onChange={(e) => handleInputChange('lga', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Religion</label>
                  <input value={formData.religion} onChange={(e) => handleInputChange('religion', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Telephone</label>
                  <input required value={formData.telephone} onChange={(e) => handleInputChange('telephone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">WhatsApp</label>
                  <input value={formData.whatsApp} onChange={(e) => handleInputChange('whatsApp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Marital Status</label>
                  <input value={formData.maritalStatus} onChange={(e) => handleInputChange('maritalStatus', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Education Level</label>
                  <select required value={formData.educationLevel} onChange={(e) => handleInputChange('educationLevel', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select Level</option>
                    <option value="GRADUATE">Graduate (N10,000)</option>
                    <option value="NON-GRADUATE">Non-Graduate (N5,000)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Handicap?</label>
                  <select required value={formData.handicap} onChange={(e) => handleInputChange('handicap', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">If YES, what's your challenge?</label>
                  <input value={formData.handicapChallenge} onChange={(e) => handleInputChange('handicapChallenge', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Valid ID Number</label>
                  <input required value={formData.validIdNumber} onChange={(e) => handleInputChange('validIdNumber', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">ID Type</label>
                  <input required value={formData.idType} onChange={(e) => handleInputChange('idType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. NIN, Passport" />
                </div>
                <div className="md:col-span-3 mt-4">
                  <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">Attach Passport / Headshot</label>
                  <input type="file" ref={passportInputRef} onChange={(e) => handleFileUpload(e, 'passportUrl')} accept="image/*" className="hidden" />
                  <div 
                    onClick={() => passportInputRef.current?.click()} 
                    onDrop={(e) => handleDrop(e, 'passportUrl')}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                  >
                    {uploadingField === 'passportUrl' ? (
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                    ) : formData.passportUrl ? (
                      <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
                    ) : (
                      <Upload className="w-8 h-8 text-white/30 mb-3" />
                    )}
                    <p className="text-sm font-bold text-white/70">
                      {formData.passportUrl ? 'Passport Photo Uploaded' : 'Click to upload passport photo'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG up to 2MB</p>
                    {formData.passportUrl && (
                      <img src={formData.passportUrl} alt="Passport preview" className="mt-4 w-20 h-20 rounded-full object-cover border border-emerald-500/50" referrerPolicy="no-referrer" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NEXT OF KIN & EMPLOYMENT */}
          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Next of Kin Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Surname</label>
                    <input required value={formData.nokSurname} onChange={(e) => handleInputChange('nokSurname', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">First Name</label>
                    <input required value={formData.nokFirstName} onChange={(e) => handleInputChange('nokFirstName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Other Name</label>
                    <input value={formData.nokOtherName} onChange={(e) => handleInputChange('nokOtherName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Address</label>
                    <input required value={formData.nokAddress} onChange={(e) => handleInputChange('nokAddress', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Telephone</label>
                    <input required value={formData.nokTelephone} onChange={(e) => handleInputChange('nokTelephone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Email</label>
                    <input type="email" value={formData.nokEmail} onChange={(e) => handleInputChange('nokEmail', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">WhatsApp</label>
                    <input value={formData.nokWhatsApp} onChange={(e) => handleInputChange('nokWhatsApp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Relationship</label>
                    <input required value={formData.nokRelationship} onChange={(e) => handleInputChange('nokRelationship', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Desired Position(s)</label>
                    <input placeholder="1." required value={formData.desiredPosition1} onChange={(e) => handleInputChange('desiredPosition1', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    <input placeholder="2." value={formData.desiredPosition2} onChange={(e) => handleInputChange('desiredPosition2', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    <input placeholder="3." value={formData.desiredPosition3} onChange={(e) => handleInputChange('desiredPosition3', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Job Location(s)</label>
                    <input placeholder="1." required value={formData.jobLocation1} onChange={(e) => handleInputChange('jobLocation1', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    <input placeholder="2." value={formData.jobLocation2} onChange={(e) => handleInputChange('jobLocation2', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    <input placeholder="3." value={formData.jobLocation3} onChange={(e) => handleInputChange('jobLocation3', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Job Mode</label>
                    <select required value={formData.jobMode} onChange={(e) => handleInputChange('jobMode', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select</option>
                      <option value="REMOTE">Remote</option>
                      <option value="ON-SITE">On-Site</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Years of Experience</label>
                    <input required value={formData.yearsOfExperience} onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GUARANTOR 1 DETAILS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Guarantor 1 Details</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-4 mb-6">
                <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Instructions to Guarantor</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This form must be completed in full and in English.</li>
                  <li>You must personally know the candidate for at least 3 years.</li>
                  <li>Provide true and accurate information — false declarations may have legal consequences.</li>
                  <li>Attach a photocopy of valid ID (National ID, International Passport, Driver's License, or other official ID).</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Surname</label>
                  <input required value={formData.g1Surname} onChange={(e) => handleInputChange('g1Surname', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">First Name</label>
                  <input required value={formData.g1FirstName} onChange={(e) => handleInputChange('g1FirstName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Other Name</label>
                  <input value={formData.g1OtherName} onChange={(e) => handleInputChange('g1OtherName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Address</label>
                  <input required value={formData.g1Address} onChange={(e) => handleInputChange('g1Address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Telephone</label>
                  <input required value={formData.g1Telephone} onChange={(e) => handleInputChange('g1Telephone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Email</label>
                  <input type="email" value={formData.g1Email} onChange={(e) => handleInputChange('g1Email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">DOB (DD | MM | YYYY)</label>
                  <input type="date" required value={formData.g1Dob} onChange={(e) => handleInputChange('g1Dob', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Sex</label>
                  <select required value={formData.g1Sex} onChange={(e) => handleInputChange('g1Sex', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Relationship to Candidate</label>
                  <input required value={formData.g1Relationship} onChange={(e) => handleInputChange('g1Relationship', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Occupation</label>
                  <input required value={formData.g1Occupation} onChange={(e) => handleInputChange('g1Occupation', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Work Address</label>
                  <input required value={formData.g1WorkAddress} onChange={(e) => handleInputChange('g1WorkAddress', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">How long have you known the candidate?</label>
                  <input required value={formData.g1KnownDuration} onChange={(e) => handleInputChange('g1KnownDuration', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">WhatsApp</label>
                  <input value={formData.g1WhatsApp} onChange={(e) => handleInputChange('g1WhatsApp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-3 mt-4">
                  <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">Attach Guarantor Passport & ID</label>
                  <input type="file" ref={g1InputRef} onChange={(e) => handleFileUpload(e, 'g1FileUrl')} className="hidden" />
                  <div 
                    onClick={() => g1InputRef.current?.click()} 
                    onDrop={(e) => handleDrop(e, 'g1FileUrl')}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                  >
                    {uploadingField === 'g1FileUrl' ? (
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                    ) : formData.g1FileUrl ? (
                      <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
                    ) : (
                      <Upload className="w-8 h-8 text-white/30 mb-3" />
                    )}
                    <p className="text-sm font-bold text-white/70">
                      {formData.g1FileUrl ? 'Guarantor ID Uploaded' : "Click to upload guarantor's photo and ID"}
                    </p>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG, PDF up to 5MB</p>
                    {formData.g1FileUrl && (
                      <p className="mt-2 text-xs text-emerald-400 max-w-xs truncate">{formData.g1FileUrl}</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-4 mt-6">Declaration</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-4">
                    <p>I hereby declare that:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>I personally know the candidate named above and confirm that the information provided by me is true and correct.</li>
                      <li>I am willing to act as a guarantor for this candidate's employment with Jackson Multifacet.</li>
                      <li>I understand and accept my responsibilities as a guarantor and agree to assist/responsibly vouch for the candidate's character and conduct as required by the Company.</li>
                      <li>I understand that providing false or misleading information may attract legal action under applicable laws.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: GUARANTOR 2 DETAILS */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Guarantor 2 Details</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-4 mb-6">
                <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Instructions to Guarantor</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This form must be completed in full and in English.</li>
                  <li>You must personally know the candidate for at least 3 years.</li>
                  <li>Provide true and accurate information — false declarations may have legal consequences.</li>
                  <li>Attach a photocopy of valid ID (National ID, International Passport, Driver's License, or other official ID).</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Surname</label>
                  <input required value={formData.g2Surname} onChange={(e) => handleInputChange('g2Surname', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">First Name</label>
                  <input required value={formData.g2FirstName} onChange={(e) => handleInputChange('g2FirstName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Other Name</label>
                  <input value={formData.g2OtherName} onChange={(e) => handleInputChange('g2OtherName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Address</label>
                  <input required value={formData.g2Address} onChange={(e) => handleInputChange('g2Address', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Telephone</label>
                  <input required value={formData.g2Telephone} onChange={(e) => handleInputChange('g2Telephone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Email</label>
                  <input type="email" value={formData.g2Email} onChange={(e) => handleInputChange('g2Email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">DOB (DD | MM | YYYY)</label>
                  <input type="date" required value={formData.g2Dob} onChange={(e) => handleInputChange('g2Dob', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Sex</label>
                  <select required value={formData.g2Sex} onChange={(e) => handleInputChange('g2Sex', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Relationship to Candidate</label>
                  <input required value={formData.g2Relationship} onChange={(e) => handleInputChange('g2Relationship', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Occupation</label>
                  <input required value={formData.g2Occupation} onChange={(e) => handleInputChange('g2Occupation', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">Work Address</label>
                  <input required value={formData.g2WorkAddress} onChange={(e) => handleInputChange('g2WorkAddress', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">How long have you known the candidate?</label>
                  <input required value={formData.g2KnownDuration} onChange={(e) => handleInputChange('g2KnownDuration', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-2">WhatsApp</label>
                  <input value={formData.g2WhatsApp} onChange={(e) => handleInputChange('g2WhatsApp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="md:col-span-3 mt-4">
                  <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">Attach Guarantor Passport & ID</label>
                  <input type="file" ref={g2InputRef} onChange={(e) => handleFileUpload(e, 'g2FileUrl')} className="hidden" />
                  <div 
                    onClick={() => g2InputRef.current?.click()} 
                    onDrop={(e) => handleDrop(e, 'g2FileUrl')}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                  >
                    {uploadingField === 'g2FileUrl' ? (
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                    ) : formData.g2FileUrl ? (
                      <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
                    ) : (
                      <Upload className="w-8 h-8 text-white/30 mb-3" />
                    )}
                    <p className="text-sm font-bold text-white/70">
                      {formData.g2FileUrl ? 'Guarantor ID Uploaded' : "Click to upload guarantor's photo and ID"}
                    </p>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG, PDF up to 5MB</p>
                    {formData.g2FileUrl && (
                      <p className="mt-2 text-xs text-emerald-400 max-w-xs truncate">{formData.g2FileUrl}</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-4 mt-6">Declaration</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-4">
                    <p>I hereby declare that:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>I personally know the candidate named above and confirm that the information provided by me is true and correct.</li>
                      <li>I am willing to act as a guarantor for this candidate's employment with Jackson Multifacet.</li>
                      <li>I understand and accept my responsibilities as a guarantor and agree to assist/responsibly vouch for the candidate's character and conduct as required by the Company.</li>
                      <li>I understand that providing false or misleading information may attract legal action under applicable laws.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: BIO DATA UPDATE (10 ACQUAINTANCES) */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">Bio Data Update</h3>
               <p className="text-xs text-white/60 mb-6 font-medium">Write down 10 acquaintances.</p>
               
               <div className="space-y-4">
                 {formData.acquaintances.map((acq, i) => (
                   <div key={i} className="flex flex-col md:flex-row gap-4 border-b border-white/5 pb-4">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-[10px] font-bold text-white/50">{i + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <input required placeholder="Surname" value={acq.surname} onChange={(e) => handleAcquaintanceChange(i, 'surname', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        <input required placeholder="First Name" value={acq.firstName} onChange={(e) => handleAcquaintanceChange(i, 'firstName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                        <input placeholder="Other Name" value={acq.otherName} onChange={(e) => handleAcquaintanceChange(i, 'otherName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* STEP 7: REVIEW AND SUBMIT */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center py-10 space-y-4">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center border-2 border-emerald-500/20">
                   <CheckCircle className="w-10 h-10 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-black text-white font-display">Ready to Submit</h3>
                 <p className="text-white/60 max-w-md mx-auto">Please ensure all attached documents are clear and all details are accurate before submitting your registration to Jackson Multifacet.</p>
               </div>
            </div>
          )}

          <div className="pt-8 border-t border-white/10 flex justify-between items-center mt-10 sticky bottom-0 bg-black/80 backdrop-blur-md p-4 rounded-xl">
             {step > 1 ? (
               <button 
                 type="button" 
                 onClick={() => setStep(step - 1)}
                 className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest transition-all"
               >
                 Back
               </button>
             ) : (
               <div />
             )}
             
             <button 
               type="submit"
               disabled={(step === 1 && !agreed) || isSubmitting}
               className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
             >
               {isSubmitting ? 'Submitting...' : step < 7 ? 'Continue' : 'Submit Registration'}
               {step < 7 && !isSubmitting && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
