import { supabase } from '../supabase';

export interface Certificate {
  id: string;
  title: string;
  type: string;
  issued: string | null;
  expiry: string | null;
  result: string | null;
  file_url: string;
  created_at: string;
  icon?: string;
  colorClass?: string;
  warning?: boolean;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching certificates:', error.message);
    return [];
  }

  // Enrich with UI presentation logic based on type or title
  return data.map((cert) => {
    let icon = 'description';
    let colorClass = 'bg-surface-container-highest text-on-surface-variant';
    let warning = false;

    if (cert.type.toLowerCase().includes('export')) {
      icon = 'verified_user';
      colorClass = 'bg-secondary-container text-on-secondary-container';
    } else if (cert.type.toLowerCase().includes('organic') || cert.title.toLowerCase().includes('organic')) {
      icon = 'potted_plant';
      colorClass = 'bg-primary-fixed text-primary';
      
      // Highlight if it's an organic cert (dummy logic for warning)
      if (cert.expiry && cert.expiry.includes('day')) {
        warning = true;
      }
    } else if (cert.type.toLowerCase().includes('batch') || cert.type.toLowerCase().includes('lab')) {
      icon = 'science';
    }

    return {
      ...cert,
      icon,
      colorClass,
      warning
    };
  });
}

export async function uploadCertificate(file: File, title: string, type: string, issued: string, expiry: string, result: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);

    // 3. Save metadata to DB
    const { error: dbError } = await supabase
      .from('certificates')
      .insert({
        title,
        type: type || 'Document',
        issued: issued || null,
        expiry: expiry || null,
        result: result || null,
        file_url: publicUrl
      });

    if (dbError) throw dbError;

    return { success: true };
  } catch (error: any) {
    console.error('Error uploading certificate:', error);
    return { success: false, error: error.message };
  }
}
