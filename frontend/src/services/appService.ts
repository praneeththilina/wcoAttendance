export interface AppVersion {
  version: string;
  name: string;
  description: string;
  buildNumber: string;
  releaseDate: string;
  minAppVersion: string;
}

export const appService = {
  async getVersion(): Promise<AppVersion> {
    const response = await fetch('/version.json');
    return response.json();
  },
};
