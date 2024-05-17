import * as OpenCC from "opencc-js"; // Chinese simplified-traditional converter

const converter = OpenCC.Converter({ from: 'jp', to: 'cn' });

export default converter;
