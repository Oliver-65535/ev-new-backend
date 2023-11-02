export const emailVerificationTemplateHtml = data => {
  return `<h3>Verification email ICAPIA</h3>
            <br/>
            Verification code:<br/>
            <h2><b>${data.code}</b></h2>
            Warning! Do not share this code with anyone!
        `;
};
