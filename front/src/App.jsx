import { useState } from 'react'
import './App.css'

function App() {
  const [deploymentType, setDeploymentType] = useState('github')
  const [projectType, setProjectType] = useState('html')
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [loadingStage, setLoadingStage] = useState(0)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const deploymentDomainSuffix = import.meta.env.VITE_DEPLOYMENT_DOMAIN_SUFFIX || '.haricharanbonam.tech'
  const deploymentUrlProtocol = import.meta.env.VITE_DEPLOYED_URL_PROTOCOL || 'http'

  const buildDeploymentUrl = (siteId) => {
    const normalizedSuffix = deploymentDomainSuffix.startsWith('.')
      ? deploymentDomainSuffix
      : `.${deploymentDomainSuffix}`

    return `${deploymentUrlProtocol}://${siteId}${normalizedSuffix}/`
  }

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
    setLoadingStage(0)
    setLoadingMessage('Initializing...')
    
    try {
      // Simulate loading stages
      setTimeout(() => { setLoadingStage(1); setLoadingMessage('Cloning repository...') }, 800)
      setTimeout(() => { setLoadingStage(2); setLoadingMessage('Building project...') }, 2500)
      setTimeout(() => { setLoadingStage(3); setLoadingMessage('Deploying...') }, 4200)

      let response
      if (deploymentType === 'github') {
        response = await fetch(`${backendUrl}/deploy/github`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repoUrl: githubUrl.trim(),
            type: projectType,
          }),
        })
      } else {
        const formData = new FormData()
        formData.append('site', file)

        response = await fetch(`${backendUrl}/deploy/file`, {
          method: 'POST',
          body: formData,
        })
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.detail || errorBody?.error || 'Deployment failed')
      }

      const data = await response.json()
      const siteId = data.siteId || data.url?.split('/')[3]
      if (!siteId) {
        throw new Error('Deployment succeeded but site ID was missing in response')
      }

      setLoadingStage(4)
      setTimeout(() => {
        setResult(buildDeploymentUrl(siteId))
        setFile(null)
        setGithubUrl('')
        setLoading(false)
      }, 800)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenUrl = () => {
    window.open(result, '_blank')
  }

  const handleNewDeployment = () => {
    setResult(null)
    setError('')
    setGithubUrl('')
    setFile(null)
    setLoadingStage(0)
  }

  return (
    <main className="deploy-container">
      <div className="stars"></div>
      <div className="deploy-content">
        <div className="header-section">
          <h1>🚀 Deploy your site</h1>
          <p className="subtitle">Lightning-fast deployments from GitHub or upload</p>
        </div>
        
        {!result ? (
          <form onSubmit={handleDeploy} className="deploy-form">
            {/* Deployment Type Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <button
                  type="button"
                  className={`tab ${deploymentType === 'github' ? 'active' : ''}`}
                  onClick={() => setDeploymentType('github')}
                >
                  <span className="tab-icon">🐙</span>
                  GitHub
                </button>
                <button
                  type="button"
                  className={`tab ${deploymentType === 'file' ? 'active' : ''}`}
                  onClick={() => setDeploymentType('file')}
                >
                  <span className="tab-icon">📁</span>
                  Upload
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="input-section">
              {deploymentType === 'github' ? (
                <div className="input-group">
                  <label htmlFor="github-url">GitHub Repository URL</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔗</span>
                    <input
                      id="github-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={handleGithubUrlChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              ) : (
                <div className="input-group">
                  <label htmlFor="file-upload">Upload your project</label>
                  <div className="file-upload-wrapper">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      disabled={loading}
                      accept=".zip,.tar,.tar.gz,.html"
                      className="file-input"
                    />
                    <label 
                      htmlFor="file-upload"
                      className={`file-upload-area ${file ? 'has-file' : ''}`}
                    >
                      <span className="upload-icon">📤</span>
                      <p className="upload-text">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="upload-hint">.zip, .tar.gz, or .html files</p>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Project Type Dropdown */}
            <div className="form-group">
              <label htmlFor="project-type">Project Type</label>
              <div className="select-wrapper">
                <span className="select-icon">⚙️</span>
                <select
                  id="project-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  disabled={loading}
                >
                  <option value="html">📄 HTML</option>
                  <option value="react">⚛️ React</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="loading-state">
                <div className="loader">
                  <div className="stage" style={{ '--stage': 1 }}></div>
                  <div className="stage" style={{ '--stage': 2 }}></div>
                  <div className="stage" style={{ '--stage': 3 }}></div>
                  <div className="stage" style={{ '--stage': 4 }}></div>
                </div>
                <p className="loading-message">{loadingMessage}</p>
                <div className="stage-indicator">
                  {['Init', 'Clone', 'Build', 'Deploy', 'Done'].map((stage, idx) => (
                    <div key={idx} className={`stage-dot ${idx <= loadingStage ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
            ) : (
              <button type="submit" className="deploy-button">
                <span className="button-glow"></span>
                <span className="button-text">🚀 Deploy Now</span>
              </button>
            )}
          </form>
        ) : (
          <div className="success-section">
            <div className="success-animation">
              <div className="success-icon">✨</div>
            </div>
            <h2 className="success-message">Deployment Successful!</h2>
            <p className="success-subtext">Your site is now live and ready to share</p>
            
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
                  className={`action-button copy-button ${copied ? 'copied' : ''}`}
                  title="Copy URL"
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
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
              + Deploy Another Site
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
