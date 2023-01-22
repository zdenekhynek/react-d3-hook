/// <reference types="react" />
export interface ID3WrapperProps {
    wrapperEl: any;
    data: any;
    width: number;
    height: number;
    d3ComponentClass: any;
    [key: string]: any;
}
export interface ID3ComponentClassInstance {
    resize: any;
    update: any;
}
export default function D3Wrapper(props: ID3WrapperProps): JSX.Element;
