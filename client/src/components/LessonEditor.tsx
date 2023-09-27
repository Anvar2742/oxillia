import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

const LessonEditor = ({
    updateContent,
    initialContent,
}: {
    updateContent: CallableFunction;
    initialContent: string | undefined;
}) => {
    const editorRef = useRef<any>(null);

    return (
        <>
            <Editor
                tinymceScriptSrc={
                    "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js"
                }
                onInit={(_evt, editor) => (editorRef.current = editor)}
                initialValue={initialContent}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                        "table",
                        "image",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | fullscreen " +
                        "removeformat | insertfile link image | help | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: "image",
                    file_picker_callback: (cb, _value, _meta) => {
                        var input = document.createElement("input");
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "image/*");

                        input.onchange = function () {
                            const target = this as HTMLInputElement;
                            var file = target.files?.[0];

                            var reader = new FileReader();
                            reader.onload = function () {
                                var id = "blobid" + new Date().getTime();

                                var blobCache =
                                    editorRef.current?.editorUpload.blobCache;
                                const result = reader?.result as string;
                                var base64 = result?.split(",")[1];

                                var blobInfo = blobCache.create(
                                    id,
                                    file,
                                    base64
                                );
                                blobCache.add(blobInfo);

                                // /* call the callback and populate some fields */
                                cb(blobInfo.blobUri(), {
                                    title: file?.name,
                                });
                            };
                            reader.readAsDataURL(file as Blob);
                        };

                        input.click();
                    },
                }}
            />
            <button
                onClick={() => updateContent(editorRef.current.getContent())}
                className="mt-4 bg-primary inline-block text-white py-2 px-8 rounded-full font-semibold hover:shadow-black hover:[text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)] transition-all"
            >
                Save
            </button>
        </>
    );
};

export default LessonEditor;