// ToolsPage.jsx
import React from 'react';
import ToolCard from './ToolsCard';
import './Tools.css'; // Import the CSS file for styling
import ScrollToTop from '../Scroll/ScrollTop'; // Import the ScrollToTop component

import { useState } from 'react';



const ToolsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

  const tools = [
  {
    title: 'Nmap',
    description: 'Scans networks to discover hosts, services, and open ports.',
    icon: '/icons/nmap.svg',
  },
  {
    title: 'OSINT',
    description: 'Collects data from public platforms to build target profiles.',
    icon: '/icons/osint.svg',
  },
  {
    title: 'bcrypt',
    description: 'Encrypts passwords using a strong hashing algorithm.',
    icon: '/icons/bcrypt.svg',
  },
  {
    title: 'SQL Injection Tester',
    description: 'Test for SQL injection vulnerabilities.',
    icon: '/icons/sql.svg',
  },
  {
    title: 'Hydra',
    description: 'Tries multiple passwords quickly to crack accounts.',
    icon: '/icons/hydra.svg',
  },
  {
    title: 'DNS Lookup',
    description: 'Gets domain-related data.',
    icon: '/icons/dns.svg',
  },
  {
  title: 'Nikto',
  description: 'Scans web servers for known vulnerabilities and configuration issues.',
  icon: '/icons/nikto.svg',
},
{
  title: 'Metasploit',
  description: 'Framework for developing and executing exploit code against a remote target machine.',
  icon: '/icons/metasploit.svg',
},
{
  title: 'Burp Suite',
  description: 'Web vulnerability scanner and proxy tool for testing web application security.',
  icon: '/icons/burp.svg',
},
{
  title: 'John the Ripper',
  description: 'Password cracker tool that supports many hash types.',
  icon: '/icons/john.svg',
},
{
  title: 'Wireshark',
  description: 'Captures and analyzes network traffic in real time.',
  icon: '/icons/wireshark.svg',
},
{
  title: 'Aircrack-ng',
  description: 'Cracks WEP/WPA WiFi passwords using packet sniffing.',
  icon: '/icons/aircrack.svg',
},
{
  title: 'Maltego',
  description: 'Performs link analysis and data mining for OSINT investigations.',
  icon: '/icons/maltego.svg',
},
{
  title: 'Shodan',
  description: 'Search engine for Internet-connected devices and services.',
  icon: '/icons/shodan.svg',
},
{
  title: 'Hashcat',
  description: 'High-performance password recovery tool supporting GPU acceleration.',
  icon: '/icons/hashcat.svg',
},
{
  title: 'ZAP',
  description: 'OWASP’s web app scanner for finding vulnerabilities in apps and APIs.',
  icon: '/icons/zap.svg',
},
{
  title: 'OpenVAS',
  description: 'Performs comprehensive vulnerability scanning and management.',
  icon: '/icons/openvas.svg',
},
{
  title: 'SQLMap',
  description: 'Automates the process of detecting and exploiting SQL injection flaws.',
  icon: '/icons/sqlmap.svg',
},
{
  title: 'Ettercap',
  description: 'Performs man-in-the-middle attacks on LAN for sniffing and injection.',
  icon: '/icons/ettercap.svg',
},
{
  title: 'Netcat',
  description: 'Swiss-army knife for network diagnostics, port scanning, and backdoors.',
  icon: '/icons/netcat.svg',
},
{
  title: 'Recon-ng',
  description: 'Powerful web reconnaissance framework with a modular interface.',
  icon: '/icons/reconng.svg',
},
{
  title: 'Angry IP Scanner',
  description: 'Fast and lightweight IP address and port scanner.',
  icon: '/icons/angryip.svg',
},
{
  title: 'Acunetix',
  description: 'Automated web vulnerability scanner for detecting over 7,000 issues.',
  icon: '/icons/acunetix.svg',
},
{
  title: 'Invicti',
  description: 'Enterprise-grade web app security scanner (formerly Netsparker).',
  icon: '/icons/invicti.svg',
},
{
  title: 'SpiderFoot',
  description: 'Automated OSINT tool for threat intelligence and attack surface mapping.',
  icon: '/icons/spiderfoot.svg',
},
{
  title: 'XploitGPT',
  description: 'AI-assisted tool for generating and analyzing exploit payloads.',
  icon: '/icons/xploitgpt.svg',
},
{
  title: 'NetHunter',
  description: 'Kali Linux’s mobile penetration testing platform for Android devices.',
  icon: '/icons/nethunter.svg',
},
{
  title: 'Cuckoo Sandbox',
  description: 'Automated malware analysis system for dynamic behavior inspection.',
  icon: '/icons/cuckoo.svg',
},
{
  title: 'Snort',
  description: 'Real-time traffic analyzer and intrusion detection system.',
  icon: '/icons/snort.svg',
},
{
  title: 'Yersinia',
  description: 'Network protocol testing tool for Layer 2 attacks.',
  icon: '/icons/yersinia.svg',
},
{
  title: 'THC-Hydra',
  description: 'Fast and flexible login cracker supporting many protocols.',
  icon: '/icons/thc.svg',
},
{
  title: 'Responder',
  description: 'Captures and relays credentials on internal networks.',
  icon: '/icons/responder.svg',
},
{
  title: 'Social-Engineer Toolkit',
  description: 'Framework for simulating social engineering attacks.',
  icon: '/icons/setoolkit.svg',
},
{
  title: 'Binwalk',
  description: 'Firmware analysis tool for reverse engineering embedded devices.',
  icon: '/icons/binwalk.svg',
},
{
  title: 'Radare2',
  description: 'Advanced open-source reverse engineering framework.',
  icon: '/icons/radare2.svg',
},
{
  title: 'Faraday',
  description: 'Collaborative pentesting and vulnerability management platform.',
  icon: '/icons/faraday.svg',
},
{
  title: 'NetStumbler',
  description: 'Detects wireless networks and helps identify weak Wi-Fi configurations.',
  icon: '/icons/netstumbler.svg',
},
{
  title: 'Fierce',
  description: 'DNS reconnaissance tool for locating non-contiguous IP space and hostnames.',
  icon: '/icons/fierce.svg',
},
{
  title: 'Wapiti',
  description: 'Performs black-box web application vulnerability scans.',
  icon: '/icons/wapiti.svg',
},
{
  title: 'Nikto2',
  description: 'Updated version of Nikto with improved web server scanning capabilities.',
  icon: '/icons/nikto2.svg',
},
{
  title: 'HTTrack',
  description: 'Website copier useful for offline analysis and reconnaissance.',
  icon: '/icons/httrack.svg',
},
{
  title: 'BeEF',
  description: 'Browser Exploitation Framework for client-side attack vectors.',
  icon: '/icons/beef.svg',
},
{
  title: 'OWASP Amass',
  description: 'Performs DNS enumeration, scraping, and mapping attack surfaces.',
  icon: '/icons/amass.svg',
},
{
  title: 'DirBuster',
  description: 'Brute-forces directories and file names on web servers.',
  icon: '/icons/dirbuster.svg',
},
{
  title: 'Fuff',
  description: 'Fast web fuzzer for discovering hidden files, directories, and parameters.',
  icon: '/icons/ffuf.svg',
},
{
  title: 'Ghidra',
  description: 'NSA’s reverse engineering suite for analyzing binaries.',
  icon: '/icons/ghidra.svg',
},
{
  title: 'Volatility',
  description: 'Memory forensics framework for analyzing RAM dumps.',
  icon: '/icons/volatility.svg',
},
{
  title: 'Censys',
  description: 'Search engine for discovering internet-connected assets and vulnerabilities.',
  icon: '/icons/censys.svg',
},
{
  title: 'Sherlock',
  description: 'Finds usernames across many social networks for OSINT investigations.',
  icon: '/icons/sherlock.svg',
},
{
  title: 'ExifTool',
  description: 'Extracts metadata from files, useful for digital forensics.',
  icon: '/icons/exiftool.svg',
},
{
  title: 'CrackMapExec',
  description: 'Swiss-army knife for pentesting Active Directory environments.',
  icon: '/icons/cme.svg',
},
{
  title: 'Empire',
  description: 'Post-exploitation framework with PowerShell and Python agents.',
  icon: '/icons/empire.svg',
},
{
  title: 'BloodHound',
  description: 'Analyzes Active Directory trust relationships for privilege escalation paths.',
  icon: '/icons/bloodhound.svg',
},
{
  title: 'Pupy',
  description: 'Cross-platform remote administration and post-exploitation tool.',
  icon: '/icons/pupy.svg',
},
{
  title: 'Scapy',
  description: 'Powerful packet manipulation tool for network discovery and attacks.',
  icon: '/icons/scapy.svg',
},
{
  title: 'Dnsenum',
  description: 'Performs DNS enumeration and zone transfers.',
  icon: '/icons/dnsenum.svg',
},
{
  title: 'ReconDog',
  description: 'All-in-one reconnaissance tool for gathering domain and IP information.',
  icon: '/icons/recondog.svg',
},
{
  title: 'Nessus',
  description: 'Industry-standard vulnerability scanner for identifying security issues.',
  icon: '/icons/nessus.svg',
},
{
  title: 'Paros Proxy',
  description: 'Intercepting proxy for analyzing and modifying HTTP/HTTPS traffic.',
  icon: '/icons/paros.svg',
},
{
  title: 'Nikto Plus',
  description: 'Enhanced version of Nikto with extended vulnerability checks.',
  icon: '/icons/niktoplus.svg',
},
{
  title: 'Dnsrecon',
  description: 'Performs DNS enumeration and zone transfers with brute-force support.',
  icon: '/icons/dnsrecon.svg',
},
{
  title: 'Sublist3r',
  description: 'Fast subdomain enumeration tool using OSINT techniques.',
  icon: '/icons/sublist3r.svg',
},
{
  title: 'Wifite',
  description: 'Automated wireless attack tool for cracking WPA/WPA2 passwords.',
  icon: '/icons/wifite.svg',
},
{
  title: 'XSStrike',
  description: 'Advanced XSS detection and exploitation suite.',
  icon: '/icons/xsstrike.svg',
},
{
  title: 'PayloadsAllTheThings',
  description: 'Massive collection of payloads for pentesting and bug bounty hunting.',
  icon: '/icons/payloads.svg',
},
{
  title: 'SecLists',
  description: 'Comprehensive collection of wordlists for fuzzing and brute-force attacks.',
  icon: '/icons/seclists.svg',
},
{
  title: 'Rubeus',
  description: 'Kerberos abuse toolkit for red teamers and post-exploitation.',
  icon: '/icons/rubeus.svg',
},
{
  title: 'Kerbrute',
  description: 'Brute-forces and enumerates Active Directory user accounts via Kerberos.',
  icon: '/icons/kerbrute.svg',
},
{
  title: 'Impacket',
  description: 'Collection of Python classes for working with network protocols.',
  icon: '/icons/impacket.svg',
},
{
  title: 'CrackStation',
  description: 'Online password hash cracker using a massive precomputed dictionary.',
  icon: '/icons/crackstation.svg',
},
{
  title: 'NoSQLMap',
  description: 'Automated NoSQL injection and exploitation tool.',
  icon: '/icons/nosqlmap.svg',
},
{
  title: 'JWT Tool',
  description: 'Toolkit for testing and exploiting JSON Web Tokens.',
  icon: '/icons/jwt.svg',
},
{
  title: 'Burp Collaborator',
  description: 'External service for detecting out-of-band vulnerabilities.',
  icon: '/icons/collaborator.svg',
},
{
  title: 'Pwncat',
  description: 'Post-exploitation platform for maintaining access and automating tasks.',
  icon: '/icons/pwncat.svg',
},
{
  title: 'Ghost Framework',
  description: 'Remote administration tool for Android devices.',
  icon: '/icons/ghost.svg',
},
{
  title: 'APKTool',
  description: 'Reverse engineers Android apps for analysis and modification.',
  icon: '/icons/apktool.svg',
},
{
  title: 'ReconSpider',
  description: 'Automated reconnaissance tool for gathering OSINT and network intel.',
  icon: '/icons/reconspider.svg',
},
{
  title: 'Hping3',
  description: 'Packet crafting tool for firewall testing and network diagnostics.',
  icon: '/icons/hping3.svg',
},
{
  title: 'ZMap',
  description: 'Fast single-packet network scanner for Internet-wide surveys.',
  icon: '/icons/zmap.svg',
},
{
  title: 'Dnsx',
  description: 'Fast and flexible DNS toolkit for subdomain enumeration and resolution.',
  icon: '/icons/dnsx.svg',
},
{
  title: 'Amass',
  description: 'Advanced tool for DNS enumeration and attack surface mapping.',
  icon: '/icons/amass.svg',
},
{
  title: 'RustScan',
  description: 'Blazing fast port scanner built in Rust.',
  icon: '/icons/rustscan.svg',
},
{
  title: 'Gospider',
  description: 'Fast web spider for discovering endpoints and URLs.',
  icon: '/icons/gospider.svg',
},
{
  title: 'Nuclei',
  description: 'Fast vulnerability scanner using customizable templates.',
  icon: '/icons/nuclei.svg',
},
{
  title: 'Dirsearch',
  description: 'Command-line tool for brute-forcing directories and files on web servers.',
  icon: '/icons/dirsearch.svg',
},
{
  title: 'Masscan',
  description: 'Internet-scale port scanner with lightning speed.',
  icon: '/icons/masscan.svg',
},
{
  title: 'Wfuzz',
  description: 'Flexible web application fuzzer for discovering hidden parameters.',
  icon: '/icons/wfuzz.svg',
},
{
  title: 'HydraX',
  description: 'Enhanced version of Hydra with GUI and extended protocol support.',
  icon: '/icons/hydrax.svg',
},
{
  title: 'Cobalt Strike',
  description: 'Commercial red teaming tool for post-exploitation and C2.',
  icon: '/icons/cobaltstrike.svg',
},
{
  title: 'Sliver',
  description: 'Open-source adversary emulation framework for red teams.',
  icon: '/icons/sliver.svg',
},
{
  title: 'Brute Ratel',
  description: 'Advanced red team operations platform with EDR evasion.',
  icon: '/icons/bruteratel.svg',
},
{
  title: 'Fierce2',
  description: 'Updated DNS recon tool for discovering hidden infrastructure.',
  icon: '/icons/fierce2.svg',
},
{
  title: 'CVE Search',
  description: 'Search engine for known vulnerabilities and exploits.',
  icon: '/icons/cvesearch.svg',
},
{
  title: 'ExploitDB CLI',
  description: 'Command-line interface for searching Exploit Database.',
  icon: '/icons/exploitdb.svg',
},
{
  title: 'PacketTotal',
  description: 'Online tool for analyzing PCAP files and detecting threats.',
  icon: '/icons/packettotal.svg',
},
{
  title: 'CyberChef',
  description: 'Swiss-army knife for encoding, decoding, and data transformation.',
  icon: '/icons/cyberchef.svg',
}

  ];

    const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
    <div className="tools-container-wrapper">
      <input
        type="text"
        className="tool-search"
        placeholder="Search for a tool..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="tools-container">
        {filteredTools.map((tool, index) => (
          <ToolCard
            key={index}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
          />
        ))}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default ToolsPage;
