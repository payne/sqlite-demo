declare module 'sql.js' {
    export interface SqlJsStatic {
      Database: typeof Database;
    }
    
    export interface Database {
      run(sql: string, params?: any[]): void;
      exec(sql: string): Array<{columns: string[], values: any[][]}>;
      export(): Uint8Array;
    }
  
    interface Config {
      locateFile: (file: string) => string;
    }
  
    export default function initSqlJs(config: Config): Promise<SqlJsStatic>;
  }
  
