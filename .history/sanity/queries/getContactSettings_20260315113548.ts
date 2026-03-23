export const contactSettingsQuery = `
*[_type == "contactPage"][0]{
  whatsapp,
  email,
  phone
}
`;
