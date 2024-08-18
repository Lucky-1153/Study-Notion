import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import {useDropzone} from "react-dropzone"
import { FiUploadCloud} from 'react-icons/fi'

import "video-react/dist/video-react.css"
import {Player} from "video-react"

const Upload = ({
    label,
    register,
    name,
    setValue,
    errors,
    video = false,
    viewData = null,
    editData = null,
}) => {

    const {course} = useSelector((state) => state.course)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    )

    const inputRef = useRef(null)

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setPreviewSource(reader.result)
        }
    }

    const onDrop = (acceptedFile) => {
        const file = acceptedFile[0]
        if(file){
            setSelectedFile(file)
            previewFile(file)
        }
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept : !video
            ? { "image/*" : [".jpeg", ".jpg", ".png"] }
            : { "video/*" : [".mp4"]},
            onDrop,
    })

    useEffect( () => {
        register(name, {required: true})

    },[register])

    useEffect( () => {
        setValue(name, selectedFile)

    },[selectedFile, setValue])


  return (
    <div>
        <label htmlFor={name}>
            {label} {!viewData && <sup>*</sup>}
        </label>
        <div>
            {previewSource ? (
                <div> 
                    {!video ? (
                        <img 
                            src={previewSource} 
                            alt="Preview" 
                        /> 
                    ) : (
                        <Player aspectRation = "16:9" playsInline src={previewSource} />
                    )}
                    {!viewData && (
                        <button 
                            type='button'
                            onClick={() => {
                                setPreviewSource = ("")
                                setSelectedFile = (null)
                                setValue(name, null)
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ) : (
                <div 
                    {...getRootProps()}
                >
                    <input {...getInputProps()} ref={inputRef} />
                    <div>
                        <FiUploadCloud />
                    </div>
                    <p>
                        Drag and drop on {!video ? "image" : "vidoe"}, or click to{" "}
                        <span>Browse</span> a file
                    </p>
                    <ul>
                        <li>Aspect ration 16:9</li>
                        <li>Recommended size 1024*576</li>
                    </ul>
                </div>
            )}
        </div>
        {errors[name] && (
            <span>
                {label} is required
            </span>
        )}
    </div>
  )
}

export default Upload