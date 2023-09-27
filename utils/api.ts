const createURL = (path: string) => {
    return window.location.origin + path
  }

  export const createNewProgress = async (content: any) => {

    const response = await fetch(
        new Request(createURL('/api/saveProgress'),{
          method: 'POST',
          body: JSON.stringify({content}),
        })
      )
  
      if(response.ok){
        const data = await response.json()
        return data.data
      }

  }

  export const getLatestSubmission = async (content: any) => {

    const response = await fetch(
        new Request(createURL('/api/latestSubmission'),{
          method: 'GET',
          body: JSON.stringify({content}),
        })
      )
  
      if(response.ok){
        const data = await response.json()
        return data.data
      }

  }
    
