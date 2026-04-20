/**
 * BACKEND API - SISTEM SUPERVISI AKADEMIK DIGITAL
 * UPT SMPN 1 MAPPEDECENG
 */

// ID Spreadsheet target integrasi
const SPREADSHEET_ID = '1mQH0R6BvSEMHn0-uPFSakSjt_QCYR9K2ZZZE_ALiO5U';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getObservations') {
    return createJsonResponse(getObservationsFromCloud());
  }
  if (action === 'clearAll') {
    return createJsonResponse(clearAllObservations());
  }
  return createJsonResponse({status: 'API Active', spreadsheetId: SPREADSHEET_ID});
}

function clearAllObservations() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi');
    if (sheet) {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = saveObservationToCloud(postData);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({success: false, error: err.toString()});
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getObservationsFromCloud() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    // Selalu pastikan struktur header benar sebelum mengambil data
    createSheetStructure(ss); 
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const obs = {};
      headers.forEach((header, index) => {
        // Jika header kosong, gunakan fallback agar tidak error di aplikasi
        const key = header || `column_${index}`;
        if (key === 'indicators') {
          try { obs[key] = JSON.parse(row[index] || '{}'); } catch(e) { obs[key] = {}; }
        } else { obs[key] = row[index]; }
      });
      return obs;
    });
  } catch (e) { return []; }
}

function saveObservationToCloud(obsData) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Observasi') || createSheetStructure(ss);
    // Pastikan struktur header konsisten sebelum simpan
    createSheetStructure(ss);

    const data = sheet.getDataRange().getValues();
    const teacherId = obsData.teacherId;
    
    // Cari baris jika sudah ada (berdasarkan ID Guru)
    const rowIndex = data.findIndex(row => row[0] == teacherId);
    
    // Pastikan data status dan feedback bersih
    const cleanStatus = String(obsData.status || '').trim();
    const cleanFeedback = String(obsData.coachingFeedback || '').trim();
    
    // Susunan kolom HARUS SAMA dengan createSheetStructure
    const rowData = [
      String(obsData.teacherId).trim(),
      String(obsData.teacherName || '').trim(),
      String(obsData.teacherNip || '').trim(),
      String(obsData.principalNip || '').trim(),
      obsData.date,
      obsData.subject,
      obsData.conversationTime,
      obsData.learningGoals || '',
      obsData.developmentArea || '',
      obsData.strategy || '',
      obsData.supervisorNotes || '',
      obsData.additionalNotes || '',
      obsData.focusId,
      JSON.stringify(obsData.indicators || {}),
      obsData.reflection || '',
      cleanFeedback,
      obsData.rtl || '',
      cleanStatus
    ];

    if (rowIndex > -1) {
      sheet.getRange(rowIndex + 1, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function createSheetStructure(ss) {
  let sheet = ss.getSheetByName('Observasi');
  const headers = [
    'teacherId', 'teacherName', 'teacherNip', 'principalNip', 'date', 'subject', 'conversationTime', 
    'learningGoals', 'developmentArea', 'strategy', 'supervisorNotes', 'additionalNotes', 'focusId', 'indicators', 'reflection', 
    'coachingFeedback', 'rtl', 'status'
  ];

  if (!sheet) {
    sheet = ss.insertSheet('Observasi');
  }

  // FORCE UPDATE HEADER: Selalu tulis ulang header di baris pertama
  // Ini memastikan nama kolom tidak akan pernah kosong di respon spreadsheet
  sheet.getRange(1, 1, 1, headers.length)
       .setValues([headers])
       .setFontWeight('bold')
       .setBackground('#f3f4f6');
  
  sheet.setFrozenRows(1);
  
  return sheet;
}