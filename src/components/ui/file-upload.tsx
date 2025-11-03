import { Input } from "./input"
import { Label } from "./label"
import React from "react"

interface FileUploadProps {
  onFileSelect: (files: FileList) => void
  accept?: string
  label?: string
  description?: string
  multiple?: boolean
}

export function FileUpload({
  onFileSelect,
  accept,
  label = "Select file",
  description,
  multiple = false
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file">{label}</Label>
      <Input
        id="file"
        type="file"
        accept={accept}
        onChange={handleChange}
        multiple={multiple}
      />
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}