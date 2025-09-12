import React from 'react';
export default function Component({children,...props}:{children?:React.ReactNode}){ return <div {...props}>{children}</div>; }
