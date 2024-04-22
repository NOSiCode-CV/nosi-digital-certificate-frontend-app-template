import Certificate from "@/models/Certificate.model";

class _CertificateMapper {
  constructor() {}
  toDomain(data: any): Certificate {
    return {
      id: data.id, //  DON'T update this line
      recipientName: data.recipientName, // update this line in order to get your value
      recipientEmail: data.recipientEmail, // update this line in order to get your value
      courseName: data.courseName, // update this line in order to get your value
      courseDescription: data.courseDescription, // update this line in order to get your value
      issueDate: data.issueDate, // update this line in order to get your value
    };
  }
}

const CertificateMapper = new _CertificateMapper();
export default CertificateMapper;
