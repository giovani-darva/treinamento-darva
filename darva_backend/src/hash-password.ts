import * as bcrypt from 'bcrypt';

async function hashPassword() {
  const password = '123456789';
  const saltRounds = 10; 

  console.log(`Gerando hash para a senha: "${password}"`);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log('--- NOVO HASH GERADO (COPIE A LINHA ABAIXO) ---');
  console.log(hashedPassword);
  console.log('--------------------------------------------------');
}

hashPassword();