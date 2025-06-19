import admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Firebase Admin
const serviceAccount = {
  projectId: "compet-lean-start-up",
  clientEmail: "firebase-adminsdk-fbsvc@compet-lean-start-up.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDLdVyoy/OxNpvK\n+riaErDInbK0BS/wvZ080SwkUYZhzG0OEiUYbengxxqUwV0LDzibLrlOjgAzdICc\n5XAvKVIDKuh2YhvPL7ey39xATJxuj8TBLDDC99WyOIDEnEHYGRATXfTCblb1ZDfq\nrewtXZqZYEUbrLUvSb7e8ih4P8QOb7A4DNU4gc3auWrrb38sMHvY9pKgw3dcywvk\nM/hf50b1V4khmJJ1JFtn0BiR+ZrMhF8I4XO3pwhOLrWaQI7QRrm2EERW+W//vE3m\nV2iruupnRbejP31sw/Q2Iwlv4ZWAyZ1lOU6HnGS3j4byr9EZ91bsl5AxOM20Qp7a\nfMrPWsXfAgMBAAECggEAMoVSfGGkgfkm51iplSyV9ELgWH4/QL68uBjSprQNs+Qw\nokFUL8Q/Qn7+NTjsky305ufLwNtW5nAD7bG1USioAjxZ2+eRszlMmqCmztqXL4cI\nmtUPyKIE0MviAbAxU2kpyj1W5R7D/gwkLGSClGM9W9+BWZVhqjvcJv0nmnBvDQwy\nH0yKOuxlBSvX1WYjlMaJ6tm0pqJVs3NW+nAV2PDbXvLcI2XQ4oT+D+3KpkLPeTMa\nidiEcP1xHtkwOcq4sOk5JBulqUfpTePUjo55zXZjwBaULzq6JlfZfb0+NMuTjxCD\nkxVDZ12bdmQUGLOKe8l1hGdzvSfyePeA53wUTNpO/QKBgQD2boz74cGgTTii/cYs\nSIg+rjnKM/M5mIn3wu3Eo/sS9URpZVDoOoNAt/+xUHB1QShA4s8MclTmf5QUnqIM\nU15E7ybOcu+wL+0hj0kRqC1KA0us4LsJ3+gAM3NCaUhXevOyMK3MeEHvEOCNUVir\nK2szXErKvBb5ousSTM9I+yeylQKBgQDTW6uStvXKV/Lc4N1WxrXHxn84IFA3Yhdu\ngjVPbaI3AguaZwqtzXUaY51s7R2M1agWXNS5oX28psqnmyIhz3VTyqK8tJeKSC53\nFI1i7mBLRRlp1W93zexK4lL2/0V189aNvsrZecQkzxyc+kAbaRHpUEZZzNJ8kJtg\nLRrVctiNowKBgFbjBZxtrbpaX8TAG1ZTwI3xGfkcNf6xtLuBpBm4A3dcuOE8Url+\nn/Z6qZGYHf6Jmaq/DWeDDEI06z4V7GbSIiPF+nXB+paxXzd88LNkC4vT+6OZnPjP\nVFp1yYa53kLR3AiQt0ang//JgJLzAoNfjK2QNeKjTKp58c4C/PbrbsS9AoGAR7R/\n/uRneuBfmqQHM5tyrHYhTw9XZ5K11F4EbBALypG9EgMHUnOz2OIW1I+VSORrhDq2\nSMwK9me3tSkiaUoSyfyjPVYfW2ClsuycEwZAUQj+WDN6/7AzDCzAbN+p1xyEm84w\nz5tJ+hrx4Cfee+4nj3oWg/zDJFODAxwKUIQIB/UCgYAkwXPNSfc09wavim9HoeK1\ng0K6wtRPWG3e7TXsOZMnS4G6/n+Q+wHADmfdcxKY2Ng75KcEUu+DMAdHHcnGzbkw\niMmc7D8QajoJkTmomCCmSzgopVgBb/iMax8eNBzp9jFaZtUCblMmxsBY9/JTyC9z\nXPLusSZJSxVK/xATWBWTHQ==\n-----END PRIVATE KEY-----"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "compet-lean-start-up.firebasestorage.app"
  });
}

const storage = admin.storage();

async function uploadTestFile() {
  try {
    // Chemin vers le fichier à uploader
    const filePath = path.join(path.dirname(__dirname), 'public', 'Logotype.svg');
    
    // Lire le fichier
    const fileContent = await fs.readFile(filePath);
    
    // Créer un nom unique
    const fileName = `test-${Date.now()}-Logotype.svg`;
    
    // Référence au bucket
    const bucket = storage.bucket("compet-lean-start-up.firebasestorage.app");
    const file = bucket.file(fileName);
    
    // Upload du fichier
    await file.save(fileContent, {
      metadata: {
        contentType: 'image/svg+xml',
      },
    });
    
    // Générer une URL signée valide pendant 1 heure
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600 * 1000,
    });
    
    console.log('Upload réussi !');
    console.log('URL du fichier:', url);
    console.log('Nom du fichier:', fileName);
    
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
  } finally {
    process.exit();
  }
}

// Exécuter le script
uploadTestFile();
