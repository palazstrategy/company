"use client";

import { useEffect } from "react";

export function EditorClientStyles() {
    useEffect(() => {
        document.body.setAttribute("data-editor", "true");
        return () => {
            document.body.removeAttribute("data-editor");
        };
    }, []);

    return (
        <style dangerouslySetInnerHTML={{ __html: `
            body[data-editor],
            body[data-editor] * {
                cursor: auto !important;
            }
            body[data-editor] a,
            body[data-editor] button,
            body[data-editor] [role="button"],
            body[data-editor] select,
            body[data-editor] label,
            body[data-editor] input[type="file"] {
                cursor: pointer !important;
            }
            body[data-editor] input[type="text"],
            body[data-editor] textarea {
                cursor: text !important;
            }
            /* Hide the custom cursor dot in editor */
            #custom-cursor-container {
                display: none !important;
            }
        `}} />
    );
}
