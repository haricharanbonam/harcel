import { useState } from 'react'
import './App.css'

function App() {
  const [deploymentType, setDeploymentType] = useState('github')
  const [projectType, setProjectType] = useState('html')
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
  }

  const handleGithubUrlChange = (e) => {
    setGithubUrl(e.target.value)
    setError('')
  }

  const handleDeploy = async (e) => {
    e.preventDefault()
    setError('')
    
    if (deploymentType === 'github' && !githubUrl.trim()) {
      setError('Please enter a GitHub URL')
      return
    }
    
    if (deploymentType === 'file' && !file) {
      setError('Please select a file to upload')
      return
    }

    setLoading(true)
    setLoadingMessage('Cloning...')
    
    try {
      const formData = new FormData()
      
      if (deploymentType === 'github') {
        formData.append('githubUrl', githubUrl)
      } else {
        formData.append('file', file)
      }
      
      formData.append('projectType', projectType)
      formData.append('deploymentType', deploymentType)

      // Simulate loading stages
      setTimeout(() => setLoadingMessage('Building...'), 2000)
      setTimeout(() => setLoadingMessage('Deploying...'), 4000)

      const response = await fetch(`${backendUrl}/deploy`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Deployment failed')
      }

      const data = await response.json()
      setResult(data.url)
      setFile(null)
      setGithubUrl('')
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(result)
  }

  const handleOpenUrl = () => {
    window.open(result, '_blank')
  }

  const handleNewDeployment = () => {
    setResult(null)
    setError('')
    setGithubUrl('')
    setFile(null)
  }

  return (
    <main className="deploy-container">
      <div className="deploy-content">
        <h1>Deploy your site</h1>
        
        {!result ? (
          <form onSubmit={handleDeploy} className="deploy-form">
            {/* Deployment Type Tabs */}
            <div className="tabs">
              <button
                type="button"
                className={`tab ${deploymentType === 'github' ? 'active' : ''}`}
                onClick={() => setDeploymentType('github')}
              >
                GitHub URL
              </button>
              <button
                type="button"
                className={`tab ${deploymentType === 'file' ? 'active' : ''}`}
                onClick={() => setDeploymentType('file')}
              >
                Upload File
              </button>
            </div>

            {/* Input Section */}
            <div className="input-section">
              {deploymentType === 'github' ? (
                <div>
                  <label htmlFor="github-url">GitHub Repository URL</label>
                  <input
                    id="github-url"
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={handleGithubUrlChange}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="file-upload">Upload your project file</label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                    accept=".zip,.tar,.tar.gz"
                  />
                  {file && <p className="file-name">Selected: {file.name}</p>}
                </div>
              )}
            </div>

            {/* Project Type Dropdown */}
            <div className="form-group">
              <label htmlFor="project-type">Project Type</label>
              <select
                id="project-type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                disabled={loading}
              >
                <option value="html">HTML</option>
                <option value="react-vite">React (Vite)</option>
              </select>
            </div>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Loading State */}
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>{loadingMessage}</p>
              </div>
            ) : (
              <button type="submit" className="deploy-button">
                Deploy
              </button>
            )}
          </form>
        ) : (
          <div className="success-section">
            <div className="success-icon">✓</div>
            <p className="success-message">Your site has been deployed!</p>
            
            <div className="url-section">
              <p className="url-label">Your deployment URL:</p>
              <div className="url-display">
                <input
                  type="text"
                  value={result}
                  readOnly
                  className="url-input"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="action-button copy-button"
                  title="Copy URL"
                >
                  📋 Copy
                </button>
                <button
                  type="button"
                  onClick={handleOpenUrl}
                  className="action-button open-button"
                  title="Open in new tab"
                >
                  🔗 Open
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewDeployment}
              className="new-deploy-button"
            >
              Deploy Another Site
            </button>
          </div>
        )}
      </div>
    </main>
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
