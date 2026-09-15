declare module "*.csv?raw" {
  const content: string;
  export default content;
}

declare module "*.csv?url" {
  const url: string;
  export default url;
}

declare module "*.woff?url" {
  const url: string;
  export default url;
}
