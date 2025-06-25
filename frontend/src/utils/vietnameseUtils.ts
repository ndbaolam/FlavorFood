
export const removeVietnameseTones = (str: string): string => {
    return str
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  export const containsAllWords = (
    text: string, 
    searchWords: string[], 
    normalizedWords: string[]
  ): boolean => {
    const lowerText = text.toLowerCase();
    const normalizedText = removeVietnameseTones(text);
    
    return searchWords.every((word, index) => 
      lowerText.includes(word) || normalizedText.includes(normalizedWords[index])
    );
  };
  
  export const prepareSearchWords = (searchText: string) => {
    const searchWords = searchText.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    const normalizedWords = searchWords.map(word => removeVietnameseTones(word));
    
    return {
      searchWords,
      normalizedWords
    };
  };

  export const flexibleSearch = (fields: string[], searchText: string): boolean => {
    if (!searchText.trim()) return true;
    
    const { searchWords, normalizedWords } = prepareSearchWords(searchText);
    
    return fields.some(field => 
      containsAllWords(field || '', searchWords, normalizedWords)
    );
  };