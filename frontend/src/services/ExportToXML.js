function exportToXML(cryptoPosts, startDate, endDate) {
    const filteredPosts = cryptoPosts.filter(post => {
      const postDate = new Date(post.date);
      return postDate >= startDate && postDate <= endDate;
    });
  
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<posts>\n';
    filteredPosts.forEach(post => {
      xmlContent += `<post>\n`;
      xmlContent += `\t<id>${post.id}</id>\n`;
      xmlContent += `\t<title>${post.title}</title>\n`;
      xmlContent += `\t<date>${post.date}</date>\n`;
      xmlContent += `\t<link>${post.link}</link>\n`;
      xmlContent += `\t<positive>${post.positive}</positive>\n`;
      xmlContent += `</post>\n`;
    });
    xmlContent += '</posts>';
  
    const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8;' });
    saveAs(blob, 'filteredPosts.xml');
  }
  
  export default exportToXML;
  