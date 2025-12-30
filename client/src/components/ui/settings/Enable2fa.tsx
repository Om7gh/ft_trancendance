import { InputField } from "../utils/Button"

function Enable2fa() {
  return (
    <div className="flex-1 p-6 m-auto">
          <form className="flex flex-col gap-5">
            <div>
            <InputField type="checkbox" name="enable2fa" id="enable2fa" />
            </div>
              <button
                        type="submit"
                        className="mt-4 rounded-lg bg-violet-600 text-slate-100 hover:bg-violet-700 transition px-4 py-2 shadow-xl shadow-slate-900"
                    >
                        Enable
                    </button>
          </form>
        </div>
  )
}

export default Enable2fa