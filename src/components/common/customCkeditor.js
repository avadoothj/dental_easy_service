import { useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CustomCkeditor(props) {
	const options = {
		data: "",
		disabled: false,
		callback: () => {},
		...props,
	};

	const [data, setData] = useState(options.data);

	const handleEditorChange = (event, editor) => {
		const finalData = editor.getData();
		setData(finalData);
		options.callback(finalData);
	};

	return (
		{/* <CKEditor
			editor={ClassicEditor}
			data={data}
			onChange={handleEditorChange}
			{...options}
		/> */}
	);
}
