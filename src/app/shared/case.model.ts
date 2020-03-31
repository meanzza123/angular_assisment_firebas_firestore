export interface Case {
    caseID: string;
    caseBy: string;
    createDate: string;
    topic: string;
    description: string;
    statusCase: string;
    updateDate: string;
    image: any;
}

export interface SearchModel {
    caseID: string;
    stDate: string;
    enDate: string;
}