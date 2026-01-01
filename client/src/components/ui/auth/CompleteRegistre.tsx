import { useState } from 'react';
import CreateUsername from './CreateUsername';
import FinishRegister from './FinishRegister';
import { Logo } from '@assets';

function CompleteRegistre() {
  const [step, setStep] = useState<number>(0);
  const nextStep = () => {
    if (step >= 1) return;
    setStep((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col gap-10 relative items-center">
      <h2 className="bg-linear-45 from-violet-500 to-neon w-fit bg-clip-text  text-transparent text-4xl text-center">
        Complete Registration
      </h2>
      <div className="w-[600px] bg-linear-to-b from-slate-800/20 to-violet-800/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center rounded-3xl">
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-violet-400 rounded-r-lg" />
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-neon rounded-l-lg" />
        <div className="bg-slate-950/30 p-4 w-full text-violet-200 flex flex-col gap-5 rounded-3xl">
          <div className="flex  items-center flex-col">
            <img src={Logo} alt="logo" className="w-40 h-auto m-auto mb-10" />
            <div className="flex justify-evenly items-center w-full mb-10">
              <p
                className={`${
                  step === 0
                    ? 'bg-violet-800'
                    : 'bg-transparent border border-violet-500/60'
                } text-lg px-6 py-2 shadow-xl shadow-slate-900 tracking-wider  `}
              >
                step 1
              </p>
              <p
                className={`${
                  step === 1
                    ? 'bg-violet-800'
                    : 'bg-transparent border border-violet-500/60'
                } text-lg px-6 py-2 shadow-xl shadow-slate-900 tracking-wider`}
              >
                step 2
              </p>
            </div>
          </div>
          <div>
            {step === 0 && <CreateUsername next={nextStep} />}
            {step === 1 && <FinishRegister />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteRegistre;
