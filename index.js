import React, { useLayoutEffect } from "react";
import { Helmet } from "react-helmet";

if (process.env.ENVIRONMENT === "browsers") {
    function adoptSheet(sheet) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }
    function removeSheet(sheet) {
        const sheets = [...document.adoptedStyleSheets];
        const index = sheets.lastIndexOf(sheet);
        if (index > -1) {
            sheets.splice(index, 1);
        }
        document.adoptedStyleSheets = sheets;
    }
    var Style = function Style({ children }) {
        useLayoutEffect(() => {
            let sheet = children;
            if (!sheet) return;
            if (Array.isArray(sheet) || typeof sheet === 'string') {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(children.toString());
            }
            if (sheet instanceof CSSStyleSheet) {
                adoptSheet(sheet);
                return () => removeSheet(sheet);
            }
        }, [children]);
        //so that react-helmet will auto remove build time style
        return <Helmet></Helmet>;
    }
} else {
    //node.js environment: doesn't have CSSStyleSheet
    var Style = function ServerSideStyle({ children: sheet }) {
        if (!sheet) {
            return <Helmet></Helmet>
        } else if (Array.isArray(sheet) || typeof sheet === 'string') {
            return <Helmet>
                <style>{sheet.toString()}</style>
            </Helmet>
        } else if (typeof CSSStyleSheet !== 'undefined' && sheet instanceof CSSStyleSheet) {
            let content = ''; for (const rule of sheet.cssRules) content += rule.cssText;
            return <Helmet>
                <style media={sheet.media.mediaText || undefined}>{content}</style>
            </Helmet>
        }
    }
}
export default Style