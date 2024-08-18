import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import ConfirmationModal from "../../../Common/ConfirmationModal"
import { deleteProfile } from "../../../../services/operations/SettingApi"
import { useState } from "react"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [check, setCheck] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState(null)

  // async function handleDeleteAccount() {
  //   try {
  //     dispatch(deleteProfile(token, navigate))
  //   } catch (error) {
  //     console.log("ERROR MESSAGE - ", error.message)
  //   }
  // }

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded-full form-style cursor-pointer"
                checked={check}
                onChange={() => setCheck(prev => !prev)}
              />
            <button
              type="button"
              className="w-fit italic text-pink-300  "
              onClick={() => check &&
                setConfirmationModal({
                  text1: "Are you sure ?",
                  text2: "Delete my account...!",
                  btn1Text: "Delete",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                  btn2Handler: () => { setConfirmationModal(null); setCheck(false) },
                })
              }
            >
              I want to delete my account.
            </button>
          </div>
          
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}