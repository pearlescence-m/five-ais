import React, { SyntheticEvent, useState } from 'react';
import { Input } from '@/components/ui/input'

export function CustomInput(props) {
  const { onChange: originalOnChange, ...restProps } = props;
  const [imageBlob, setImageBlob] = useState("");

  // Define your custom onChange handler
  const handleImageInputChange = (event: SyntheticEvent) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBlob(reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    // If there was an original onChange handler, call it
    if (originalOnChange) {
      originalOnChange(event);
    }
  };

  return (
    <Input {...restProps} onChange={handleImageInputChange} />
  );
}