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
    stg: {
      p_cms:'WqCxiZQCGxSUiOKlbllYpLycCcoiqcls'
    },
    prod: {
      p_cms:'WqCxiZQCGxSUiOKlbllYpLycCcoiqcls'
    },
  };
  
  export default tokenConfig;