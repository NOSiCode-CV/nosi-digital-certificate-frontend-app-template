import { STRAPI_API } from "../../constants/constants";
import CertificateMapper from "@/mappers/CertificateMapper";
import Certificate from "@/models/Certificate.model";

class _CMSClient {
  constructor() {}
  /**
   * 
   * @param email List all you certificates
   * @returns 
   */
  async list(email: string): Promise<Certificate[]> {

    try {
      const userCertificate = `${STRAPI_API}?filters[recipientEmail][$eq]=${email}`;

      const res = await fetch(userCertificate);

      const certificates = await res.json();

      return (
        certificates.data?.map((i: any) =>
          CertificateMapper.toDomain({ id: i.id, ...i.attributes })
        ) ?? []
      );
    } catch (e) {
      console.error("🔴 ERROR FETCHING STRAPI CMS", e);
      return [];
    }
  }
}

const CMSClient = new _CMSClient();
export default CMSClient;
