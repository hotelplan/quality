interface TokenConfig {
    p_cms: string;
  }
  
  const tokenConfig: Record<string, TokenConfig> = {
    dev: {
      p_cms:''
    },
    dev_test:{
      p_cms:'WqCxiZQCGxSUiOKlbllYpLycCcoiqcls'
    },
    qa: {
      p_cms:'WqCxiZQCGxSUiOKlbllYpLycCcoiqcls'
    },
    staging: {
      p_cms:'WqCxiZQCGxSUiOKlbllYpLycCcoiqcls'
    },
    production: {
      p_cms:''
    },
  };
  
  export default tokenConfig;