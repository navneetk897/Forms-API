import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import { METHODS } from "http";

const BASEURI = 'https://api.bentley.com/';

export default class FormsAPIClient {
    private authClient: BrowserAuthorizationClient;
    private iTwinId: string;

    constructor(authClient: BrowserAuthorizationClient, iTwinId: string) {
        this.authClient = authClient;
        this.iTwinId = iTwinId;
    }

    public async getWorkFlow(type: string) {
        const url = `${BASEURI}type?projectId=${this.iTwinId}`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.json());
            return result;
        } catch(error) {

        }
    }

    public async getFormsDefinitions() {
        const url = `${BASEURI}forms/formDefinitions?projectId=${this.iTwinId}`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async createFormData(data: any) {
        const url = `${BASEURI}forms/`;
        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    'Conten-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async deleteFormData(id: string) {
        const url = `${BASEURI}forms/${id}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            });
            if (response.ok) {
                return true;
            }
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    public async getFormData(id: string) {
        const url = `${BASEURI}forms/${id}`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }
    public async getProjectFormData(type: string) {
        const url = `${BASEURI}forms/?projectId=${this.iTwinId}f&type=${type}`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    Prefer: 'return=minimal'
                }
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async updateFormData(id: string, data: any) {
        const url = `${BASEURI}forms/${id}`;
        try {
            const result = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    'Conten-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async downloadFormAsFile(id: string) {
        const url = `${BASEURI}forms/${id}/download?fileType=pdf&includeHeader=true`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.arrayBuffer());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async exportFormToStorage(id: string) {
        const url = `${BASEURI}forms/storageExport?ids=${id}&includeHeader=true&fileType=pdf`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            });
            if (response.ok) {
                return true;
            }
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    public async addCommentToForm(id: string, comment: any) {
        const url = `${BASEURI}forms/${id}/comments`;
        try {
            const reponse = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            });
            if (reponse.ok) return true;
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    public async deleteFormComment(id: string, commentId: string) {
        const url = `${BASEURI}forms/${id}/comments/${commentId}`;
        try {
            const reponse = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            });
            if (reponse.ok) return true;
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    public async getFormComments(id: string) {
        const url = `${BASEURI}forms/${id}/comments`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    Prefer: 'return=minimal'
                }
            }).then(response => response.json);
            return result;
        } catch(error) {

        }
    }

    public async getFromAuditTrail(id: string) {
        const url = `${BASEURI}forms/${id}/auditTrailEntries`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }


    public async addAttachmentToForm(id: string, data: any) {
        const url = `${BASEURI}forms/${id}/attachments`;
        try {
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async deleteAttachment(id: string, attachmentId: string) {
        const url = `${BASEURI}forms/${id}/attachments/${attachmentId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken(),
                }
            });
            if (response.ok) return true;
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    public async getAttachment(id: string, attachmentId: string) {
        const url = `${BASEURI}forms/${id}/attachments/{$attachmentId}`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.arrayBuffer());
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    public async getFormDataAttachment(id: string) {
        const url = `${BASEURI}forms/${id}/attachments`;
        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                }
            }).then(response => response.json());
            return result;
        } catch(error) {

        }
    }

    public async uploadAttachmentToForm(id: string, attachmentId: string, data: any) {
        const url = `${BASEURI}forms/${id}/attachments/${attachmentId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/vnd.bentley.itwin-platform.v1+json',
                    Authorization: await this.authClient.getAccessToken()
                },
                body: JSON.stringify(data)
            });
            if (response.ok) return true;
            return false;
        } catch(error) {
            console.log(error);
        }
    }

}