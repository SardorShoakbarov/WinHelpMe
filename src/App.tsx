import React, { useState, useEffect } from 'react';
import { Search, Terminal, Copy, Info, Zap, Shield, Network, HardDrive, Settings, FileText, Play, CheckCircle } from 'lucide-react';
import { FaGithub, FaInstagram, FaTelegram } from 'react-icons/fa';

interface Command {
  name: string;
  category: string;
  description: string;
  syntax: string;
  explanation: string;
  examples: string[];
  technicalTerms: { [key: string]: string };
  relatedCommands: string[];
}

const COMMANDS: Command[] = [
  // File Operations
  {
    name: "ASSOC",
    category: "File Operations",
    description: "Fayl kengaytmasini dastur bilan bog'laydi",
    syntax: "ASSOC [.ext[=[fileType]]]",
    explanation: "ASSOC kommandasi fayl kengaytmasini ma'lum bir dastur bilan bog'lash uchun ishlatiladi. Bu Windows'da faylni ikki marta bosganda qaysi dastur ochishini belgilaydi.",
    examples: [
      "ASSOC .txt=txtfile",
      "ASSOC .mp3=WMP11.AssocFile.MP3",
      "ASSOC .pdf"
    ],
    technicalTerms: {
      "Fayl kengaytmasi": "Fayl nomidan keyin nuqtadan keyin yoziladigan qisim (.txt, .exe, .pdf kabi)",
      "File Association": "Fayl kengaytmasini ma'lum dastur bilan bog'lash tizimi"
    },
    relatedCommands: ["FTYPE", "START"]
  },
  {
    name: "ATTRIB",
    category: "File Operations",
    description: "Fayl atributlarini ko'rsatadi yoki o'zgartiradi (readonly, hidden)",
    syntax: "ATTRIB [+R | -R] [+A | -A] [+S | -S] [+H | -H] [drive:][path][filename]",
    explanation: "ATTRIB kommandasi fayllarning maxsus xususiyatlarini (atributlarini) boshqaradi. Masalan, faylni faqat o'qish uchun qilish, yashirish yoki tizim fayli deb belgilash mumkin.",
    examples: [
      "ATTRIB +R file.txt",
      "ATTRIB +H -R secret.doc",
      "ATTRIB /S /D +H *.tmp"
    ],
    technicalTerms: {
      "Read-only": "Faqat o'qish uchun - fayl o'zgartirilmaydi",
      "Hidden": "Yashirin fayl - oddiy holatda ko'rinmaydi",
      "System": "Tizim fayli - muhim tizim fayllari",
      "Archive": "Arxiv belgisi - backup uchun ishlatiladi"
    },
    relatedCommands: ["DIR", "COPY", "XCOPY"]
  },
  {
    name: "CD / CHDIR",
    category: "Navigation",
    description: "Joriy papkani o'zgartiradi yoki ko'rsatadi",
    syntax: "CD [/D] [drive:][path]",
    explanation: "CD (Change Directory) kommandasi fayl tizimida navigatsiya qilish uchun ishlatiladi. Joriy ishchi papkani o'zgartiradi yoki hozirgi papka yo'lini ko'rsatadi.",
    examples: [
      "CD C:\\Windows",
      "CD ..",
      "CD /D D:\\Projects",
      "CD \"Program Files\""
    ],
    technicalTerms: {
      "Joriy katalog": "Hozirda ishlayotgan papka",
      "..": "Yuqori darajadagi papka (parent directory)",
      ".": "Hozirgi papka (current directory)",
      "Mutlaq yo'l": "To'liq yo'l disk harfidan boshlab"
    },
    relatedCommands: ["DIR", "PUSHD", "POPD", "TREE"]
  },
  {
    name: "CHKDSK",
    category: "System & Disk",
    description: "Diskni xatolarga tekshiradi",
    syntax: "CHKDSK [volume[[path]filename]]] [/F] [/V] [/R] [/X] [/I] [/C] [/L[:size]] [/B] [/scan] [/spotfix]",
    explanation: "CHKDSK (Check Disk) kommandasi qattiq diskni fayl tizimi xatolari, yomon sektorlar va boshqa muammolarga tekshiradi va tuzatadi.",
    examples: [
      "CHKDSK C:",
      "CHKDSK D: /F /R",
      "CHKDSK /scan"
    ],
    technicalTerms: {
      "Bad sector": "Diskdagi buzilgan joy - ma'lumot saqlay olmaydi",
      "File system": "Fayllarni diskda tashkil qilish tizimi (NTFS, FAT32)",
      "/F parametr": "Topilgan xatolarni avtomatik tuzatish",
      "/R parametr": "Yomon sektorlarni topib qayta tiklash"
    },
    relatedCommands: ["SCANDISK", "SFC", "DISM"]
  },
  {
    name: "CLS",
    category: "Display",
    description: "Ekranni tozalaydi",
    syntax: "CLS",
    explanation: "CLS (Clear Screen) kommandasi terminal oynasidagi barcha matnni tozalab, kursorni yuqori chap burchakga qo'yadi.",
    examples: [
      "CLS"
    ],
    technicalTerms: {
      "Terminal": "Matn asosidagi interfeys orqali kompyuter bilan muloqot qilish oynasi",
      "Command prompt": "Windows'ning buyruq qatori interfeysi"
    },
    relatedCommands: ["ECHO", "COLOR"]
  },
  {
    name: "COPY",
    category: "File Operations",
    description: "Fayl(lar)ni nusxalaydi",
    syntax: "COPY [/D] [/V] [/N] [/Y | /-Y] [/Z] [/L] [/A | /B] source [/A | /B] [destination [/A | /B]]",
    explanation: "COPY kommandasi fayllarni bir joydan boshqa joyga nusxalash uchun ishlatiladi. Asl fayl o'z joyida qoladi.",
    examples: [
      "COPY file.txt D:\\Backup",
      "COPY *.doc C:\\Documents\\",
      "COPY /Y source.txt destination.txt"
    ],
    technicalTerms: {
      "Wildcard": "* va ? belgilar orqali bir nechta faylni tanlash",
      "/Y parametr": "Ustiga yozishni tasdiqlashsiz amalga oshirish",
      "Source": "Manba fayl - nusxalanadigan fayl",
      "Destination": "Mo'ljal - faylni qayerga nusxalash"
    },
    relatedCommands: ["XCOPY", "ROBOCOPY", "MOVE"]
  },
  {
    name: "DEL / ERASE",
    category: "File Operations", 
    description: "Faylni o'chiradi",
    syntax: "DEL [/P] [/F] [/S] [/Q] [/A[[:]attributes]] names",
    explanation: "DEL yoki ERASE kommandasi fayllarni o'chirish uchun ishlatiladi. O'chirilgan fayllar odatda Recycle Bin'ga o'tmaydi.",
    examples: [
      "DEL file.txt",
      "DEL *.tmp",
      "DEL /S /Q temp\\*.*"
    ],
    technicalTerms: {
      "/P parametr": "Har bir fayl o'chirishdan oldin so'raydi",
      "/F parametr": "Read-only fayllarni ham majburiy o'chiradi",
      "/S parametr": "Barcha ichi-papkalarda ham qidiradi",
      "/Q parametr": "Jimgina rejim - hech narsa so'ramaydi"
    },
    relatedCommands: ["RMDIR", "ATTRIB", "UNDELETE"]
  },
  {
    name: "DIR",
    category: "File Operations",
    description: "Papkadagi fayllarni ko'rsatadi",
    syntax: "DIR [drive:][path][filename] [/A[[:]attributes]] [/B] [/C] [/D] [/L] [/N] [/O[[:]sortorder]] [/P] [/Q] [/R] [/S] [/T[[:]timefield]] [/W] [/X] [/4]",
    explanation: "DIR kommandasi papka tarkibini ko'rish uchun eng ko'p ishlatiladigan kommanda. Fayllar va papkalar haqida batafsil ma'lumot beradi.",
    examples: [
      "DIR",
      "DIR C:\\Users",
      "DIR *.txt",
      "DIR /S /B *.exe"
    ],
    technicalTerms: {
      "/S parametr": "Barcha ichi-papkalarni ham ko'rsatadi",
      "/B parametr": "Faqat fayl nomlarini ko'rsatadi",
      "/P parametr": "Sahifa-sahifa ko'rsatadi",
      "Long filename": "255 belgigacha bo'lgan uzun fayl nomlari"
    },
    relatedCommands: ["TREE", "ATTRIB", "CD"]
  },
  {
    name: "MKDIR / MD",
    category: "File Operations",
    description: "Yangi papka yaratadi",
    syntax: "MKDIR [drive:]path yoki MD [drive:]path",
    explanation: "MKDIR (Make Directory) yoki MD kommandasi yangi papka yaratish uchun ishlatiladi. Bir nechta darajali papkalarni ham bir vaqtda yaratishi mumkin.",
    examples: [
      "MKDIR NewFolder",
      "MD C:\\Projects\\WebApp",
      "MKDIR \"Folder with spaces\""
    ],
    technicalTerms: {
      "Directory": "Papka - fayllar va boshqa papkalarni saqlash joyi",
      "Subdirectory": "Ichi-papka - boshqa papka ichidagi papka",
      "Path separator": "\\ belgisi yo'l ajratuvchisi"
    },
    relatedCommands: ["RMDIR", "CD", "DIR"]
  },
  {
    name: "MOVE",
    category: "File Operations",
    description: "Fayl yoki papkani ko'chiradi",
    syntax: "MOVE [/Y | /-Y] [drive:][path]filename1[,...] destination",
    explanation: "MOVE kommandasi fayllarni yoki papkalarni bir joydan boshqa joyga ko'chirib o'tkazadi. Asl joydan o'chirib, yangi joyga qo'yadi.",
    examples: [
      "MOVE file.txt D:\\NewFolder",
      "MOVE *.bak backup\\",
      "MOVE OldName NewName"
    ],
    technicalTerms: {
      "Ko'chirish vs Nusxalash": "Move asl faylni o'chiradi, Copy esa qoldiradi",
      "Rename": "Fayl nomini o'zgartirish ham MOVE kommandasi bilan amalga oshiriladi"
    },
    relatedCommands: ["COPY", "REN", "XCOPY"]
  },
  {
    name: "REN / RENAME",
    category: "File Operations",
    description: "Fayl nomini o'zgartiradi",
    syntax: "REN [drive:][path]filename1 filename2",
    explanation: "REN yoki RENAME kommandasi fayl yoki papka nomini o'zgartirish uchun ishlatiladi. Fayl o'z joyida qoladi, faqat nomi o'zgaradi.",
    examples: [
      "REN file.txt newfile.txt",
      "REN *.bak *.old",
      "RENAME \"Old Name\" \"New Name\""
    ],
    technicalTerms: {
      "Batch rename": "Bir vaqtda ko'plab faylning nomini o'zgartirish",
      "Extension": "Fayl kengaytmasi - nomdan keyin nuqtadan keyingi qism"
    },
    relatedCommands: ["MOVE", "COPY", "DIR"]
  },
  {
    name: "RMDIR / RD",
    category: "File Operations",
    description: "Papkani o'chiradi",
    syntax: "RMDIR [/S] [/Q] [drive:]path",
    explanation: "RMDIR (Remove Directory) yoki RD kommandasi bo'sh papkalarni o'chiradi. /S parametri bilan ichida fayl bo'lgan papkalarni ham o'chirish mumkin.",
    examples: [
      "RMDIR FolderName",
      "RD /S /Q TempFolder",
      "RMDIR \"Folder With Spaces\""
    ],
    technicalTerms: {
      "/S parametr": "Papka va undagi barcha fayllarni o'chiradi",
      "/Q parametr": "Hech narsa so'ramay o'chiradi (quiet mode)",
      "Empty directory": "Bo'sh papka - ichida hech narsa yo'q"
    },
    relatedCommands: ["MKDIR", "DEL", "TREE"]
  },
  {
    name: "TREE",
    category: "File Operations",
    description: "Papka tuzilmasini daraxt ko'rinishida ko'rsatadi",
    syntax: "TREE [drive:][path] [/F] [/A]",
    explanation: "TREE kommandasi papka tuzilmasini daraxt shaklidagi chiziqlar bilan ko'rsatadi. Bu struktura ko'rish uchun juda qulay.",
    examples: [
      "TREE C:\\",
      "TREE /F",
      "TREE D:\\Projects /A"
    ],
    technicalTerms: {
      "/F parametr": "Fayllarni ham ko'rsatadi (faqat papkalar emas)",
      "/A parametr": "ASCII belgilar ishlatadi (chiziq o'rniga)",
      "Directory tree": "Papkalarning daraxtsimon tuzilishi"
    },
    relatedCommands: ["DIR", "CD", "ATTRIB"]
  },
  {
    name: "TYPE",
    category: "Text & Search",
    description: "Tekst fayl tarkibini ko'rsatadi",
    syntax: "TYPE [drive:][path]filename",
    explanation: "TYPE kommandasi matn faylining to'liq tarkibini ekranda ko'rsatadi. Binary fayllar uchun ishlatmang - tushunarsiz belgilar chiqadi.",
    examples: [
      "TYPE file.txt",
      "TYPE config.ini",
      "TYPE *.log"
    ],
    technicalTerms: {
      "Text file": "Matn fayli - odamlar o'qiy oladigan belgilardan iborat",
      "Binary file": "Ikkilik fayl - dasturlar uchun mo'ljallangan",
      "ASCII": "Amerika Standart Kod - matnni raqamlash tizimi"
    },
    relatedCommands: ["MORE", "FIND", "EDIT"]
  },
  {
    name: "XCOPY",
    category: "File Operations",
    description: "Papkalarni ham nusxalaydi (COPYdan kuchliroq)",
    syntax: "XCOPY source [destination] [/A | /M] [/D[:date]] [/P] [/S [/E]] [/V] [/W] [/C] [/I] [/Q] [/F] [/L] [/G] [/H] [/R] [/T] [/U] [/K] [/N] [/O] [/X] [/Y] [/-Y] [/Z] [/B] [/EXCLUDE:file1[+file2][+file3]...]",
    explanation: "XCOPY - COPY'dan kuchliroq versiya. Papkalar va ularning ichidagi barcha fayllarni nusxalash, atributlarni saqlash va boshqa murakkab amallarni bajara oladi.",
    examples: [
      "XCOPY C:\\Data D:\\Backup /E",
      "XCOPY *.doc Archive\\ /D",
      "XCOPY Source Dest /S /Y"
    ],
    technicalTerms: {
      "/E parametr": "Bo'sh papkalarni ham nusxalaydi",
      "/S parametr": "Ichi-papkalarni nusxalaydi",
      "/D parametr": "Faqat yangi fayllarni nusxalaydi",
      "/Y parametr": "Tasdiqlashsiz ustiga yozadi"
    },
    relatedCommands: ["COPY", "ROBOCOPY", "MOVE"]
  },
  {
    name: "ROBOCOPY",
    category: "File Operations",
    description: "Juda kuchli nusxalash vositasi",
    syntax: "ROBOCOPY source destination [file [file]...] [options]",
    explanation: "ROBOCOPY (Robust File Copy) - Windows'ning eng kuchli fayl nusxalash vositasi. Katta fayllar, tarmoq orqali nusxalash, xatolardan tiklanish va boshqa professional funksiyalar mavjud.",
    examples: [
      "ROBOCOPY C:\\Data D:\\Backup /MIR",
      "ROBOCOPY Source Dest /E /Z /R:3",
      "ROBOCOPY . Backup /S /XD temp"
    ],
    technicalTerms: {
      "/MIR parametr": "Mirror - to'liq nusxa, ortiqcha fayllarni o'chiradi",
      "/E parametr": "Barcha ichi-papkalarni nusxalaydi",
      "/Z parametr": "Restart mode - uzilgan nusxalashni davom ettiradi",
      "/R:n parametr": "n marta qayta urinish"
    },
    relatedCommands: ["XCOPY", "COPY", "SYNC"]
  },

  // System & Disk
  {
    name: "BCDEDIT",
    category: "System & Disk",
    description: "Boot konfiguratsiyasini o'zgartiradi",
    syntax: "BCDEDIT [/store filename] [command [command-options]]",
    explanation: "BCDEDIT kommandasi Windows'ning yuklash konfiguratsiyasini boshqaradi. Safe mode, boot optionlari va boshqa yuklash parametrlarini sozlash mumkin.",
    examples: [
      "BCDEDIT /set {current} safeboot minimal",
      "BCDEDIT /deletevalue {current} safeboot",
      "BCDEDIT /enum"
    ],
    technicalTerms: {
      "Boot Configuration Data": "Windows yuklash ma'lumotlari bazasi",
      "Safe mode": "Xavfsiz rejim - minimal drayverlarda yuklash",
      "GUID": "Global Unique Identifier - noyob identifikator"
    },
    relatedCommands: ["BOOTCFG", "MSCONFIG"]
  },
  {
    name: "CHKNTFS",
    category: "System & Disk",
    description: "Disk yuklashda tekshirilishini boshqaradi",
    syntax: "CHKNTFS volume [...] | /D | /T[:time] | /X volume [...] | /C volume [...]",
    explanation: "CHKNTFS kommandasi Windows yuklanganda diskni avtomatik tekshirish funksiyasini boshqaradi.",
    examples: [
      "CHKNTFS /X C:",
      "CHKNTFS /D",
      "CHKNTFS /T:30"
    ],
    technicalTerms: {
      "NTFS": "New Technology File System - Windows'ning asosiy fayl tizimi",
      "Boot-time scan": "Yuklash vaqtida diskni tekshirish",
      "/X parametr": "Diskni tekshirishdan chiqarib qo'yish"
    },
    relatedCommands: ["CHKDSK", "FSUTIL"]
  },
  {
    name: "CONVERT",
    category: "System & Disk",
    description: "FAT diskni NTFS ga aylantiradi",
    syntax: "CONVERT volume /FS:NTFS [/V] [/CvtArea:filename] [/NoSecurity] [/X]",
    explanation: "CONVERT kommandasi FAT yoki FAT32 fayl tizimini NTFS ga aylantiradi. Bu jarayon qaytarib bo'lmaydi va ma'lumotlarni saqlaydi.",
    examples: [
      "CONVERT D: /FS:NTFS",
      "CONVERT E: /FS:NTFS /V"
    ],
    technicalTerms: {
      "FAT32": "File Allocation Table - eski fayl tizimi",
      "NTFS": "Yangi fayl tizimi - xavfsizlik va katta fayllar",
      "File system": "Diskda fayllarni tashkil qilish usuli"
    },
    relatedCommands: ["FORMAT", "DISKPART"]
  },
  {
    name: "DISKPART",
    category: "System & Disk", 
    description: "Disk bo'limlarini boshqaradi",
    syntax: "DISKPART",
    explanation: "DISKPART - disk bo'limlarini yaratish, o'chirish, o'lchamini o'zgartirish va boshqarish uchun kuchli vosita. Interaktiv rejimda ishlaydi.",
    examples: [
      "DISKPART",
      "LIST DISK",
      "SELECT DISK 1",
      "CREATE PARTITION PRIMARY"
    ],
    technicalTerms: {
      "Partition": "Disk bo'limi - diskni mantiqiy qismlarga bo'lish",
      "Primary partition": "Asosiy bo'lim - bootable bo'lishi mumkin",
      "Extended partition": "Kengaytirilgan bo'lim - logical disklar uchun",
      "MBR": "Master Boot Record - diskni yuklash ma'lumotlari"
    },
    relatedCommands: ["FORMAT", "FDISK", "CONVERT"]
  },
  {
    name: "FORMAT",
    category: "System & Disk",
    description: "Diskni formatlaydi",
    syntax: "FORMAT volume [/FS:file-system] [/V:label] [/Q] [/A:size] [/C] [/X] [/P:passes]",
    explanation: "FORMAT kommandasi diskni to'liq tozalaydi va yangi fayl tizimi o'rnatadi. DIQQAT: Barcha ma'lumotlar yo'qoladi!",
    examples: [
      "FORMAT D: /FS:NTFS",
      "FORMAT E: /Q",
      "FORMAT F: /FS:FAT32 /V:USB_DISK"
    ],
    technicalTerms: {
      "/Q parametr": "Tez formatlash - faqat fayl tizimini qayta yozadi",
      "/FS parametr": "Fayl tizimini tanlash (NTFS, FAT32)",
      "/V parametr": "Disk yorlig'ini berish",
      "Quick format": "Tez formatlash - ma'lumotlarni aslida o'chirmaydi"
    },
    relatedCommands: ["DISKPART", "CONVERT", "CHKDSK"]
  },
  {
    name: "FSUTIL",
    category: "System & Disk",
    description: "Fayl tizimining past darajadagi amallari",
    syntax: "FSUTIL behavior | dirty | file | fsinfo | hardlink | objectid | quota | repair | reparsepoint | sparse | usn | volume",
    explanation: "FSUTIL - fayl tizimi bilan past darajada ishlash uchun professional vosita. Disk ma'lumotlari, sparse fayllar, hard linklar va boshqalar.",
    examples: [
      "FSUTIL fsinfo drives",
      "FSUTIL volume diskfree C:",
      "FSUTIL file createnew test.txt 1000"
    ],
    technicalTerms: {
      "File system": "Diskda fayllarni saqlash va tashkil qilish tizimi",
      "Sparse file": "Siyrak fayl - bo'sh joylarni saqlmaydigan fayl",
      "Hard link": "Qattiq bog'lam - bir faylga ko'plab nom berish",
      "USN Journal": "Update Sequence Number - o'zgarishlar jurnali"
    },
    relatedCommands: ["CHKDSK", "DISKPART", "ATTRIB"]
  },
  {
    name: "LABEL",
    category: "System & Disk",
    description: "Disk yorlig'ini o'zgartiradi",
    syntax: "LABEL [drive:][label]",
    explanation: "LABEL kommandasi diskka nom (yorliq) berish yoki mavjud nomni o'zgartirish uchun ishlatiladi. Bu nom Explorer'da ko'rinadi.",
    examples: [
      "LABEL D: BackupDisk",
      "LABEL E:",
      "LABEL C: \"System Disk\""
    ],
    technicalTerms: {
      "Volume label": "Disk yorlig'i - diskka beriladigan nom",
      "Drive letter": "Disk harfi (C:, D:, E: va hokazo)",
      "File system": "NTFS, FAT32 kabi fayl saqlash tizimi"
    },
    relatedCommands: ["VOL", "FORMAT", "DIR"]
  },
  {
    name: "VOL",
    category: "System & Disk",
    description: "Disk nomi va seriya raqamini ko'rsatadi",
    syntax: "VOL [drive:]",
    explanation: "VOL kommandasi diskning joriy nomini (yorlig'ini) va seriya raqamini ko'rsatadi.",
    examples: [
      "VOL D:",
      "VOL",
      "VOL C:"
    ],
    technicalTerms: {
      "Volume serial number": "Diskni identifikatsiya qiluvchi noyob raqam",
      "Volume label": "Diskka berilgan nom",
      "Current drive": "Hozir ishlayotgan disk"
    },
    relatedCommands: ["LABEL", "DIR", "FSUTIL"]
  },

  // Processes & System Info
  {
    name: "TASKLIST",
    category: "Processes & System Info",
    description: "Ishlayotgan jarayonlarni ko'rsatadi",
    syntax: "TASKLIST [/S system [/U username [/P [password]]]] [/M [module] | /SVC | /V] [/FI filter] [/FO format] [/NH]",
    explanation: "TASKLIST kommandasi kompyuterdagi barcha ishlab turgan dasturlar va jarayonlarni ro'yxatini ko'rsatadi.",
    examples: [
      "TASKLIST",
      "TASKLIST /FI \"IMAGENAME eq notepad.exe\"",
      "TASKLIST /SVC"
    ],
    technicalTerms: {
      "Process": "Jarayon - ishlab turgan dastur yoki xizmat",
      "PID": "Process ID - har bir jarayonning noyob raqami",
      "Memory usage": "Xotira ishlatilishi - jarayon qancha RAM ishlatayotgani",
      "System process": "Tizim jarayoni - Windows tizimi tomonidan ishga tushirilgan"
    },
    relatedCommands: ["TASKKILL", "WMIC", "SYSTEMINFO"]
  },
  {
    name: "TASKKILL",
    category: "Processes & System Info",
    description: "Jarayonni to'xtatadi",
    syntax: "TASKKILL [/S system [/U username [/P [password]]]] {[/FI filter] [...] [/PID processid | /IM imagename]} [/T] [/F]",
    explanation: "TASKKILL kommandasi ishlab turgan dasturlarni yoki jarayonlarni to'xtatish uchun ishlatiladi.",
    examples: [
      "TASKKILL /IM notepad.exe /F",
      "TASKKILL /PID 1234",
      "TASKKILL /F /T /IM chrome.exe"
    ],
    technicalTerms: {
      "/F parametr": "Majburiy to'xtatish (Force)",
      "/T parametr": "Bola jarayonlarni ham to'xtatish",
      "/IM parametr": "Image Name - dastur nomi bo'yicha",
      "/PID parametr": "Process ID bo'yicha to'xtatish"
    },
    relatedCommands: ["TASKLIST", "TSKILL", "WMIC"]
  },
  {
    name: "SYSTEMINFO",
    category: "Processes & System Info",
    description: "Kompyuter haqida to'liq ma'lumot",
    syntax: "SYSTEMINFO [/S system [/U username [/P [password]]]] [/FO format] [/NH]",
    explanation: "SYSTEMINFO kommandasi kompyuter, operatsion tizim, apparat ta'minotlari haqida batafsil ma'lumot beradi.",
    examples: [
      "SYSTEMINFO",
      "SYSTEMINFO /FO CSV",
      "SYSTEMINFO | FIND \"Total Physical Memory\""
    ],
    technicalTerms: {
      "BIOS": "Basic Input/Output System - asosiy kirish-chiqarish tizimi",
      "RAM": "Random Access Memory - operativ xotira",
      "Hotfix": "Tizimga o'rnatilgan tuzatishlar",
      "Service Pack": "Tizimni yangilash to'plami"
    },
    relatedCommands: ["MSINFO32", "WMIC", "DXDIAG"]
  },
  {
    name: "DRIVERQUERY",
    category: "Processes & System Info", 
    description: "O'rnatilgan drayverlar ro'yxati",
    syntax: "DRIVERQUERY [/S system [/U username [/P [password]]]] [/FO format] [/NH] [/SI] [/V]",
    explanation: "DRIVERQUERY kommandasi tizimdagi barcha o'rnatilgan drayverllar haqida ma'lumot beradi.",
    examples: [
      "DRIVERQUERY",
      "DRIVERQUERY /V",
      "DRIVERQUERY /SI"
    ],
    technicalTerms: {
      "Driver": "Drayver - apparat va dasturiy ta'minot o'rtasidagi aloqa",
      "Kernel mode": "Yadro rejimi - tizim darajasidagi dostup",
      "User mode": "Foydalanuvchi rejimi - oddiy dasturlar darajasi",
      "/V parametr": "Batafsil ma'lumot ko'rsatish"
    },
    relatedCommands: ["DEVMGMT.MSC", "PNPUTIL", "SC"]
  },
  {
    name: "SC",
    category: "Processes & System Info",
    description: "Xizmatlarni boshqaradi",
    syntax: "SC [command] [service name] <option1> <option2>...",
    explanation: "SC (Service Control) kommandasi Windows xizmatlarini boshqarish uchun ishlatiladi. Xizmatlarni to'xtatish, ishga tushirish, konfiguratsiya qilish mumkin.",
    examples: [
      "SC query",
      "SC start Spooler",
      "SC stop Themes"
    ],
    technicalTerms: {
      "Windows Service": "Windows xizmati - fonda ishlaydigan dastur",
      "Service status": "Xizmat holati - running, stopped, paused",
      "Startup type": "Yuklash turi - automatic, manual, disabled",
      "Dependencies": "Bog'liqliklar - boshqa xizmatlardan qaram bo'lish"
    },
    relatedCommands: ["NET", "SERVICES.MSC", "TASKLIST"]
  },
  {
    name: "SCHTASKS",
    category: "Processes & System Info",
    description: "Rejalashtirilgan vazifalarni boshqaradi",
    syntax: "SCHTASKS /parameter [arguments]",
    explanation: "SCHTASKS kommandasi Windows Task Scheduler orqali avtomatik bajariluvchi vazifalarni boshqaradi.",
    examples: [
      "SCHTASKS /Query",
      "SCHTASKS /Create /TN \"MyTask\" /TR notepad.exe /SC daily",
      "SCHTASKS /Delete /TN \"MyTask\""
    ],
    technicalTerms: {
      "Task Scheduler": "Vazifalar rejalashtiruvchisi - Windows xizmati",
      "Trigger": "Tetiklovchi - vazifani ishga tushiruvchi hodisa",
      "Action": "Harakat - bajariluvchi amal",
      "Scheduled task": "Rejalashtirilgan vazifa - avtomatik bajariluvchi ish"
    },
    relatedCommands: ["AT", "TASKSCHD.MSC"]
  },
  {
    name: "SHUTDOWN",
    category: "Processes & System Info",
    description: "Kompyuterni o'chiradi yoki qayta yuklaydi",
    syntax: "SHUTDOWN [/i | /l | /s | /sg | /r | /g | /a | /p | /h | /e | /o] [/hybrid] [/fw] [/f] [/m \\\\computer] [/t xxx] [/d [p|u:]xx:yy [/c \"comment\"]]",
    explanation: "SHUTDOWN kommandasi kompyuterni o'chirish, qayta yuklash yoki foydalanuvchini chiqarish uchun ishlatiladi.",
    examples: [
      "SHUTDOWN /s /t 0",
      "SHUTDOWN /r /t 60",
      "SHUTDOWN /l"
    ],
    technicalTerms: {
      "/s parametr": "Shutdown - kompyuterni o'chirish",
      "/r parametr": "Restart - qayta yuklash",
      "/l parametr": "Log off - foydalanuvchini chiqarish",
      "/t parametr": "Vaqt kechikishi (soniyalarda)"
    },
    relatedCommands: ["LOGOFF", "RESTART", "HIBERNATE"]
  },

  // Text & Search
  {
    name: "ECHO",
    category: "Text & Search",
    description: "Xabar chiqaradi yoki echo rejimini yoqadi/o'chiradi",
    syntax: "ECHO [ON | OFF] [message]",
    explanation: "ECHO kommandasi matn chiqarish yoki batch fayldagi komandalarni ko'rsatish/yashirish uchun ishlatiladi.",
    examples: [
      "ECHO Salom",
      "ECHO OFF",
      "ECHO. > newfile.txt"
    ],
    technicalTerms: {
      "ECHO ON": "Komandalar ekranda ko'rsatiladi",
      "ECHO OFF": "Komandalar yashirinadi",
      "@ECHO OFF": "Bu komandani o'zini ham yashiradi",
      "Output redirection": "Chiqishni faylga yo'naltirish"
    },
    relatedCommands: ["TYPE", "CLS", "@"]
  },
  {
    name: "FIND",
    category: "Text & Search",
    description: "Matnni fayldan qidiradi",
    syntax: "FIND [/V] [/C] [/N] [/I] [/OFF[LINE]] \"string\" [[drive:][path]filename[ ...]]",
    explanation: "FIND kommandasi fayllarda ma'lum matnni qidiradi va topilgan qatorlarni ko'rsatadi.",
    examples: [
      "FIND \"Hello\" file.txt",
      "FIND /I \"error\" *.log",
      "FIND /C \"Windows\" system.txt"
    ],
    technicalTerms: {
      "/I parametr": "Katta-kichik harflarni farqlamaslik",
      "/C parametr": "Faqat topilgan qatorlar sonini ko'rsatish",
      "/N parametr": "Qator raqamlarini ham ko'rsatish",
      "Case sensitive": "Katta-kichik harflarni farqlash"
    },
    relatedCommands: ["FINDSTR", "GREP", "TYPE"]
  },
  {
    name: "FINDSTR",
    category: "Text & Search",
    description: "Murakkab matn qidirish (regex)",
    syntax: "FINDSTR [/B] [/E] [/L] [/R] [/S] [/I] [/X] [/V] [/N] [/M] [/O] [/P] [/F:file] [/C:string] [/G:file] [/D:dir] [/A:color] [/OFF[LINE]] strings [[drive:][path]filename[ ...]]",
    explanation: "FINDSTR - FIND'dan kuchliroq qidiruv vositasi. Regular expression va murakkab qidiruv patternlarini qo'llab-quvvatlaydi.",
    examples: [
      "FINDSTR /R \"^Error\" log.txt",
      "FINDSTR /I \"hello world\" *.txt",
      "FINDSTR /B \"Start\" /E \"End\" file.txt"
    ],
    technicalTerms: {
      "Regular Expression": "Regex - murakkab matn qidiruv patterni",
      "/R parametr": "Regex rejimini yoqadi",
      "/B parametr": "Qator boshidagi mos kelishlar",
      "/E parametr": "Qator oxiridagi mos kelishlar"
    },
    relatedCommands: ["FIND", "GREP", "SELECT-STRING"]
  },
  {
    name: "MORE",
    category: "Text & Search",
    description: "Matnni sahifalab ko'rsatadi",
    syntax: "MORE [/E [/C] [/P] [/S] [/Tn] [+n]] < [drive:][path]filename",
    explanation: "MORE kommandasi uzun matnlarni sahifa-sahifa ko'rsatadi. Har sahifadan keyin to'xtaydi va davom etish uchun tugma bosishni kutadi.",
    examples: [
      "TYPE long.txt | MORE",
      "MORE < bigfile.txt",
      "DIR | MORE"
    ],
    technicalTerms: {
      "Pipe": "| belgisi - bir komandaning chiqishini boshqasiga berish",
      "Pagination": "Sahifalash - katta matnni bo'laklarga bo'lish",
      "LESS": "Unix/Linux'dagi MORE'ning kengaytirilgan versiyasi"
    },
    relatedCommands: ["TYPE", "FIND", "SORT"]
  },
  {
    name: "SORT",
    category: "Text & Search",
    description: "Matnni tartiblaydi",
    syntax: "SORT [/R] [/+n] [/M kilobytes] [/L locale] [/REC recordbytes] [[drive1:][path1]filename1] [/T [drive2:][path2]] [/O [drive3:][path3]filename3]",
    explanation: "SORT kommandasi matn qatorlarini alifbo tartibida yoki raqamli tartibda joylashtiradi.",
    examples: [
      "SORT names.txt",
      "DIR | SORT /R",
      "SORT /+3 data.txt"
    ],
    technicalTerms: {
      "/R parametr": "Teskari tartibda - Z dan A gacha",
      "/+n parametr": "n-ustun bo'yicha tartiblash",
      "Ascending": "O'sish tartibida (A dan Z gacha)",
      "Descending": "Kamayish tartibida (Z dan A gacha)"
    },
    relatedCommands: ["FIND", "MORE", "FC"]
  },

  // Programs & Command Control
  {
    name: "CALL",
    category: "Programs & Command Control",
    description: "Boshqa batch faylni chaqiradi",
    syntax: "CALL [drive:][path]filename [batch-parameters]",
    explanation: "CALL kommandasi bir batch fayldan boshqa batch faylni chaqirish uchun ishlatiladi. Chaqirilgan fayl tugagach, asl faylga qaytadi.",
    examples: [
      "CALL other.bat",
      "CALL setup.bat param1 param2",
      "CALL :label"
    ],
    technicalTerms: {
      "Batch file": "Avtomatik bajariluvchi komandalar fayli",
      "Subroutine": "Ichki dastur - CALL orqali chaqiriladigan qism",
      "Parameters": "Parametrlar - batch faylga beriladigan qiymatlar",
      "Return": "Qaytish - chaqirilgan joyga qaytsih"
    },
    relatedCommands: ["GOTO", "EXIT", "IF"]
  },
  {
    name: "CMD",
    category: "Programs & Command Control",
    description: "Yangi CMD sessiyasi ochadi",
    syntax: "CMD [/A | /U] [/Q] [/D] [/E:ON | /E:OFF] [/F:ON | /F:OFF] [/V:ON | /V:OFF] [[/S] [/C | /K] string]",
    explanation: "CMD kommandasi yangi buyruq qatori oynasi ochadi yoki mavjud sessiyani sozlaydi.",
    examples: [
      "CMD /K echo Salom",
      "CMD /C dir",
      "CMD /Q"
    ],
    technicalTerms: {
      "/K parametr": "Komandani bajarib oynani ochiq qoldiradi",
      "/C parametr": "Komandani bajarib oynani yopadi",
      "/Q parametr": "Echo'ni o'chiradi",
      "Command processor": "Komandalar protsessori"
    },
    relatedCommands: ["EXIT", "START", "CALL"]
  },
  {
    name: "COLOR",
    category: "Display",
    description: "Matn va fon rangini o'zgartiradi",
    syntax: "COLOR [attr]",
    explanation: "COLOR kommandasi CMD oynasining fon va matn ranglarini o'zgartiradi. Raqam va harf kombinatsiyasi ishlatiladi.",
    examples: [
      "COLOR 0A",
      "COLOR F0",
      "COLOR 17"
    ],
    technicalTerms: {
      "Hexadecimal": "16-lik sanoq tizimi (0-9, A-F)",
      "Background color": "Fon rangi - birinchi belgi",
      "Text color": "Matn rangi - ikkinchi belgi",
      "Color codes": "Rang kodlari: 0=qora, 1=ko'k, 2=yashil, va hokazo"
    },
    relatedCommands: ["CLS", "ECHO", "PROMPT"]
  },
  {
    name: "DOSKEY",
    category: "Programs & Command Control",
    description: "Buyruqlar tarixini va makrosini boshqaradi",
    syntax: "DOSKEY [/REINSTALL] [/LISTSIZE=size] [/MACROS[:ALL | :exename]] [/HISTORY] [/INSERT | /OVERSTRIKE] [/EXENAME=exename] [/MACROFILE=filename] [macroname=[text]]",
    explanation: "DOSKEY kommandasi avval kiritilgan komandalarni eslab qolish va makros yaratish imkonini beradi.",
    examples: [
      "DOSKEY ls=DIR",
      "DOSKEY /HISTORY",
      "DOSKEY h=DOSKEY /HISTORY"
    ],
    technicalTerms: {
      "Macro": "Makros - qisqartma kommanda",
      "Command history": "Komandalar tarixi",
      "Alias": "Taxallus - komanda uchun boshqa nom",
      "Buffer": "Bufer - ma'lumot saqlanadigan joy"
    },
    relatedCommands: ["ALIAS", "HISTORY"]
  },
  {
    name: "FOR",
    category: "Programs & Command Control",
    description: "Fayllar ustida aylantirib buyruq bajaradi",
    syntax: "FOR %variable IN (set) DO command [command-parameters]",
    explanation: "FOR kommandasi bir guruh fayllar yoki qiymatlar ustida bir xil komandani takrorlash uchun ishlatiladi.",
    examples: [
      "FOR %i IN (*.txt) DO ECHO %i",
      "FOR /L %i IN (1,1,10) DO ECHO %i",
      "FOR /D %i IN (*) DO DIR \"%i\""
    ],
    technicalTerms: {
      "Loop": "Sikl - takrorlanuvchi jarayon",
      "Variable": "O'zgaruvchi - qiymat saqlovchi",
      "/L parametr": "Raqamli sikl",
      "/D parametr": "Papkalar ustida sikl"
    },
    relatedCommands: ["IF", "GOTO", "CALL"]
  },
  {
    name: "GOTO",
    category: "Programs & Command Control",
    description: "Batch faylda ma'lum joyga o'tadi",
    syntax: "GOTO label",
    explanation: "GOTO kommandasi batch fayl ichida belgilangan joyga (label) o'tish uchun ishlatiladi.",
    examples: [
      "GOTO label",
      "GOTO end",
      "GOTO :EOF"
    ],
    technicalTerms: {
      "Label": "Yorliq - batch fayldagi belgilangan joy",
      ":EOF": "End of File - fayl oxiri",
      "Jump": "Sakrash - boshqa joyga o'tish",
      "Control flow": "Boshqaruv oqimi"
    },
    relatedCommands: ["CALL", "IF", "EXIT"]
  },
  {
    name: "IF",
    category: "Programs & Command Control",
    description: "Shartli bajarish",
    syntax: "IF [NOT] ERRORLEVEL number command | IF [NOT] string1==string2 command | IF [NOT] EXIST filename command",
    explanation: "IF kommandasi ma'lum shart bajarilganda komandani ishga tushirish uchun ishlatiladi.",
    examples: [
      "IF EXIST file.txt ECHO Bor",
      "IF \"%1\"==\"help\" ECHO Yordam",
      "IF NOT ERRORLEVEL 1 ECHO Muvaffaqiyat"
    ],
    technicalTerms: {
      "Condition": "Shart - tekshiriladigan holat",
      "ERRORLEVEL": "Xato darajasi - dasturning chiqish kodi",
      "String comparison": "Matn solishtirish",
      "Boolean logic": "Mantiqiy operatsiyalar"
    },
    relatedCommands: ["FOR", "GOTO", "EXIST"]
  },
  {
    name: "PAUSE",
    category: "Programs & Command Control",
    description: "Batch faylni to'xtatib turadi",
    syntax: "PAUSE",
    explanation: "PAUSE kommandasi batch faylning bajarilishini vaqtincha to'xtatadi va 'Press any key to continue...' xabarini ko'rsatadi.",
    examples: [
      "PAUSE",
      "ECHO Amal tugadi & PAUSE",
      "DIR & PAUSE & CLS"
    ],
    technicalTerms: {
      "Batch file": "Batch fayl - avtomatik bajariluvchi komandalar ro'yxati (.bat, .cmd)",
      "Execution": "Bajarish - komandalarni ishga tushirish jarayoni",
      "User interaction": "Foydalanuvchi bilan o'zaro aloqa",
      "Script debugging": "Skriptni tuzatish - xatolarni topish"
    },
    relatedCommands: ["ECHO", "TIMEOUT", "CHOICE"]
  },
  {
    name: "REM",
    category: "Programs & Command Control",
    description: "Batch faylda izoh qo'yadi",
    syntax: "REM [comment]",
    explanation: "REM (Remark) kommandasi batch fayliga izoh qo'shish uchun ishlatiladi. Bu qator bajarilmaydi, faqat tushuntirish uchun.",
    examples: [
      "REM Bu izoh",
      "REM Fayllarni nusxalash",
      "REM TODO: Xatolarni tekshirish kerak"
    ],
    technicalTerms: {
      "Comment": "Izoh - kod tushuntiruvi",
      "Documentation": "Hujjatlashtirish - kodni tushuntirish",
      "Non-executable": "Bajarilmaydigan - faqat o'qish uchun",
      "Code annotation": "Kod izohi"
    },
    relatedCommands: ["ECHO", "::"]
  },
  {
    name: "START",
    category: "Programs & Command Control", 
    description: "Yangi oynada dastur ishga tushiradi",
    syntax: "START [\"title\"] [/D path] [/I] [/MIN] [/MAX] [/SEPARATE | /SHARED] [/LOW | /NORMAL | /HIGH | /REALTIME | /ABOVENORMAL | /BELOWNORMAL] [/NODE node] [/AFFINITY mask] [/WAIT] [/B] [command/program] [parameters]",
    explanation: "START kommandasi dasturlarni yangi oynada yoki jarayonda ishga tushiradi.",
    examples: [
      "START notepad.exe",
      "START /MAX calc.exe",
      "START \"My Window\" cmd.exe"
    ],
    technicalTerms: {
      "/MAX parametr": "To'liq ekranda ochish",
      "/MIN parametr": "Minimallashtirilgan holda ochish",
      "/WAIT parametr": "Dastur tugashini kutish",
      "Process priority": "Jarayon ustuvorligi"
    },
    relatedCommands: ["CALL", "CMD", "RUN"]
  }
];

const CATEGORIES = [
  { name: 'All', icon: Terminal, color: 'text-green-400' },
  { name: 'File Operations', icon: HardDrive, color: 'text-blue-400' },
  { name: 'Navigation', icon: Network, color: 'text-purple-400' },
  { name: 'System & Disk', icon: Settings, color: 'text-red-400' },
  { name: 'Processes & System Info', icon: Zap, color: 'text-yellow-400' },
  { name: 'Text & Search', icon: FileText, color: 'text-cyan-400' },
  { name: 'Programs & Command Control', icon: Play, color: 'text-orange-400' },
  { name: 'Display', icon: Shield, color: 'text-pink-400' }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [copiedCommand, setCopiedCommand] = useState('');
  const [showTermDefinition, setShowTermDefinition] = useState<{term: string, definition: string} | null>(null);

  const filteredCommands = COMMANDS.filter(command => {
    const matchesSearch = command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         command.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || command.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const showDefinition = (term: string, definition: string) => {
    setShowTermDefinition({ term, definition });
    setTimeout(() => setShowTermDefinition(null), 4000);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Matrix-style background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat opacity-30" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00ff41 1px, transparent 0)', 
                     backgroundSize: '30px 30px' }}>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-green-800 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="h-10 w-10 text-green-400 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold text-green-400 glowing-text">WinHelpme.exe</h1>
                <p className="text-green-600">Project by TheDeep OPC</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 text-sm">COMMANDS LOADED: {COMMANDS.length}</div>
              <div className="text-green-600 text-xs">SYSTEM STATUS: ONLINE</div>
            </div>
            
          </div>
           <div className='SocialIcons'>
             <a
        href="https://www.instagram.com/sardor.ok"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 text-2xl transition-colors"
    >
        <FaInstagram />
        </a>
          <a
        href="https://t.me/sardorshoakbarov"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 text-2xl transition-colors"
    >
        <FaTelegram />
        </a>
          <a
        href="https://github.com/SardorShoakbarov"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 text-2xl transition-colors"
    >
        <FaGithub />
        </a>
           </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-green-800 rounded-lg p-6 backdrop-blur terminal-box">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <Shield className="mr-2" size={20} />
                CONTROL PANEL
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-400 mb-2">SEARCH DATABASE</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-green-600" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter command name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black border border-green-800 rounded text-green-400 placeholder-green-600 focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-green-400 mb-3">CATEGORIES</label>
                <div className="space-y-2">
                  {CATEGORIES.map(category => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded transition-all duration-200 text-left ${
                          selectedCategory === category.name
                            ? 'bg-green-800/30 text-green-400 border border-green-700'
                            : 'text-green-600 hover:text-green-400 hover:bg-green-900/20'
                        }`}
                      >
                        <IconComponent size={16} className={category.color} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-4 border-t border-green-800">
                <div className="text-xs text-green-600">
                  <div>FILTERED: {filteredCommands.length}</div>
                  <div>TOTAL: {COMMANDS.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredCommands.length === 0 ? (
              <div className="bg-gray-900/50 border border-red-800 rounded-lg p-12 text-center terminal-box">
                <Terminal size={48} className="mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-bold text-red-400 mb-2">SYSTEM ERROR: NO MATCH FOUND</h3>
                <p className="text-red-600">Adjust search parameters or select different category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCommands.map(command => {
                  const category = CATEGORIES.find(c => c.name === command.category);
                  const IconComponent = category?.icon || Terminal;
                  
                  return (
                    <div
                      key={command.name}
                      className="bg-gray-900/50 border border-green-800 rounded-lg p-6 transition-all duration-300 hover:border-green-600 hover:bg-gray-900/70 terminal-box group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <IconComponent size={24} className={category?.color || 'text-green-400'} />
                          <div>
                            <h3 className="text-xl font-bold text-green-400 glowing-text">{command.name}</h3>
                            <span className="text-sm text-green-600">{command.category}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(command.syntax)}
                            className={`p-2 rounded transition-all duration-200 ${
                              copiedCommand === command.syntax
                                ? 'bg-green-700 text-green-100'
                                : 'bg-green-900/50 text-green-400 hover:bg-green-800'
                            }`}
                          >
                            {copiedCommand === command.syntax ? <CheckCircle size={16} /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => setSelectedCommand(selectedCommand?.name === command.name ? null : command)}
                            className="p-2 bg-blue-900/50 text-blue-400 hover:bg-blue-800 rounded transition-all duration-200"
                          >
                            <Info size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-green-300 mb-4">{command.description}</p>
                      
                      <div className="mb-4">
                        <div className="text-sm text-green-600 mb-2">SYNTAX:</div>
                        <code className="bg-black/50 border border-green-800 rounded px-3 py-2 text-green-400 text-sm block font-mono overflow-x-auto">
                          {command.syntax}
                        </code>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-green-600 mb-2">EXAMPLES:</div>
                          <div className="space-y-1">
                            {command.examples.slice(0, 2).map((example, idx) => (
                              <code
                                key={idx}
                                className="bg-black/30 border border-green-900 rounded px-2 py-1 text-green-400 text-xs block cursor-pointer hover:bg-green-900/20"
                                onClick={() => copyToClipboard(example)}
                              >
                                {example}
                              </code>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-green-600 mb-2">RELATED:</div>
                          <div className="flex flex-wrap gap-1">
                            {command.relatedCommands.slice(0, 3).map(relatedCmd => (
                              <span
                                key={relatedCmd}
                                className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs cursor-pointer hover:bg-green-800/30"
                                onClick={() => setSearchTerm(relatedCmd)}
                              >
                                {relatedCmd}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedCommand?.name === command.name && (
                        <div className="mt-6 pt-4 border-t border-green-800 animate-fadeIn">
                          <div className="mb-4">
                            <h4 className="text-green-400 font-bold mb-2">DETAILED EXPLANATION:</h4>
                            <p className="text-green-300 text-sm leading-relaxed">{command.explanation}</p>
                          </div>

                          {Object.keys(command.technicalTerms).length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-green-400 font-bold mb-2">TECHNICAL TERMS:</h4>
                              <div className="space-y-2">
                                {Object.entries(command.technicalTerms).map(([term, definition]) => (
                                  <div
                                    key={term}
                                    className="bg-black/30 border border-green-900 rounded p-3 cursor-pointer hover:border-green-700"
                                    onClick={() => showDefinition(term, definition)}
                                  >
                                    <div className="text-yellow-400 font-bold text-sm">{term}:</div>
                                    <div className="text-green-300 text-xs mt-1">{definition}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {command.examples.length > 2 && (
                            <div>
                              <h4 className="text-green-400 font-bold mb-2">MORE EXAMPLES:</h4>
                              <div className="space-y-1">
                                {command.examples.slice(2).map((example, idx) => (
                                  <code
                                    key={idx}
                                    className="bg-black/30 border border-green-900 rounded px-2 py-1 text-green-400 text-xs block cursor-pointer hover:bg-green-900/20"
                                    onClick={() => copyToClipboard(example)}
                                  >
                                    {example}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Definition Popup */}
      {showTermDefinition && (
        <div className="fixed top-4 right-4 bg-black border-2 border-yellow-400 rounded-lg p-4 max-w-sm z-50 animate-slideInRight terminal-box">
          <div className="text-yellow-400 font-bold text-sm mb-1">{showTermDefinition.term}</div>
          <div className="text-green-300 text-xs">{showTermDefinition.definition}</div>
        </div>
      )}

      {/* Copy notification */}
      {copiedCommand && (
        <div className="fixed bottom-4 right-4 bg-green-800 border border-green-400 rounded-lg p-3 z-50 animate-slideInUp">
          <div className="text-green-100 text-sm font-bold">COPIED TO BUFFER</div>
          <div className="text-green-300 text-xs truncate max-w-xs">{copiedCommand}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
        
        .glowing-text {
          text-shadow: 0 0 10px #00ff41;
        }
        
        .terminal-box {
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
        }
        
        .terminal-box:hover {
          box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #00ff41;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #00cc33;
        }
      `}</style>
    </div>
  );
}

export default App;