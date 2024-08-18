import React, { useEffect } from 'react'
import { useState } from 'react'
import { MdClose} from "react-icons/md"
import { useSelector } from "react-redux"

const ChipInput = ( {
    label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues
}) => {

    const {editCourse, course} = useSelector( (state) => state.course)

    //setting up state for managing chips array
    const [chips, setChips] = useState([])

    useEffect( () => {
        if(editCourse)
            setChips(course?.tag)

        register(name, { 
            required: true,
            validate: (value) => value.length > 0
        })
    },[]) 

    useEffect( () => {
        setValue(name, chips)
    }, [chips])

    const handleDeleteChip = async( chipsIndex) => {
       const newChips =  chips.filter((_, index) => index != chipsIndex)
        setChips(newChips)
    }

    const handleKeyDown = (e) => {
        if( e.key ==="Enter" || e.key === ","){
            e.preventDefault()
            const chipValue = e.target.value.trim()

            if(chipValue && !chips.includes(chipValue)){
                const newChips = [...chips, chipValue]
                setChips(newChips)
                event.target.value = ""
            }
        }
    }

  return (
    <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}>
            {label} 
        </label>
        <div className="flex w-full flex-wrap gap-y-2">
            {
                chips.map( (chip, index) => (
                    <div 
                        key={index} 
                        className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                    > 
                    {/* chip value */}
                        {chip}
                        {/* chip delete button */}
                        <button 
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                )) 
            }
            {/* Render the input for adding new chips */}
            <input 
                type="text"
                id={name}
                name={name}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                className='form-style w-full'
            />
        </div>
        {/* Render an error message if the input is required and not filled */}
        {errors.name && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                {label} is required
            </span>
        )}
    </div>
  )
}

export default ChipInput