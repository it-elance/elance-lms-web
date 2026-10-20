// Browsers can't show Office files, so they open in Microsoft's online
// viewer. PDFs and images open as they are.
const OFFICE_FILE_TYPES = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
const OFFICE_VIEWER_URL = 'https://view.officeapps.live.com/op/view.aspx?src=';

// The material's file type is its extension (pdf, docx, ...); older ones may
// lack it, so the URL's extension stands in
const getExtension = (fileUrl: string, fileType?: string) => {
  const type = fileType?.toLowerCase().trim();
  if (type && /^[a-z0-9]+$/.test(type)) return type;

  return fileUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
};

// The page that previews the file in a new tab
export const getMaterialPreviewUrl = (fileUrl: string, fileType?: string) =>
  OFFICE_FILE_TYPES.includes(getExtension(fileUrl, fileType))
    ? `${OFFICE_VIEWER_URL}${encodeURIComponent(fileUrl)}`
    : fileUrl;

const getDownloadName = (title: string, extension: string) => {
  const name = title.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'material';

  return extension && !name.toLowerCase().endsWith(`.${extension}`)
    ? `${name}.${extension}`
    : name;
};

const clickLink = (href: string, downloadName?: string) => {
  const link = document.createElement('a');
  link.href = href;
  if (downloadName) {
    link.download = downloadName;
  } else {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Saves the file under the material's title. A link's download attribute is
// ignored for another site's file (S3), so the file is fetched first, which
// needs a CORS rule on the bucket. Without one the fetch is blocked and the
// file opens instead: Office files still download, PDFs and images open in a
// new tab.
export const downloadMaterial = async (
  fileUrl: string,
  title: string,
  fileType?: string
) => {
  try {
    const response = await fetch(fileUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const objectUrl = URL.createObjectURL(await response.blob());
    clickLink(
      objectUrl,
      getDownloadName(title, getExtension(fileUrl, fileType))
    );
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    console.warn('Material download blocked, opening the file:', error);
    clickLink(fileUrl);
  }
};
