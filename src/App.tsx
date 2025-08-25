import { useCallback, useEffect, useState, ReactElement } from 'react'
import { useAppInitStage, AppInitStageProgression, SessionStartupType, useTrackAppInitStage } from './AppInit'
import { fromTodoStore } from './Todos/todo-store'
import { useSessionContextIdentity } from './SessionContext'
import { getUserList } from './ApiClient'
import { sessionContextIdentityStore } from './SessionContext/ContextIdentity/store'
import { ulid } from 'ulid'
import { appInitStore } from './AppInit/store'

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Badge,
  Alert,
  Spinner,
  Form,
  Image,
} from 'react-bootstrap'

export const App = (): ReactElement<any, any> => {
  const todos = fromTodoStore.use.todos()
  const toggleTodo = fromTodoStore(state => state.toggleTodo)

  const { startType, isFirstAppLaunch, currentStage: initStage } = useAppInitStage()
  const { appSessionId, externalDeviceSessionId, externalUserId, anonymousId } = useSessionContextIdentity()

  // Users state
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [localStorageInfo, setLocalStorageInfo] = useState<{
     hasData: boolean;
     dataSize: number; 
     lastStartupTimestamp?: string
  }>({ hasData: false, dataSize: 0, lastStartupTimestamp: 'n/a' })

  const { setSessionStartupType, setIsFirstAppLaunch } = useTrackAppInitStage({
    isFirstAppLaunch,
    startType,
  })

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true)
    try {
      const userList = await getUserList()
      setUsers(userList)
      console.log('Fetched users:', userList)
    }
    catch (error) {
      console.error('Error fetching users:', error)
    }
    finally {
      setIsLoadingUsers(false)
    }
  }, [])

  const toggleSessionStartupType = useCallback(() => {
    console.log('toggleSessionStartupType', startType)
    setSessionStartupType(startType === SessionStartupType.COLD_START ? SessionStartupType.WARM_START : SessionStartupType.COLD_START)
  }, [startType, setSessionStartupType])

  const toggleIsFirstAppLaunch = useCallback(() => {
    console.log('toggleIsFirstAppLaunch', isFirstAppLaunch)
    setIsFirstAppLaunch(!isFirstAppLaunch)
  }, [isFirstAppLaunch, setIsFirstAppLaunch])

  const setExternalUserId = useCallback(() => {
    const newUserId = ulid().slice(0, 10);
    sessionContextIdentityStore.getState().setExternalUserId(newUserId)
    console.log('----> Setting externalUserId to be:', newUserId)
  }, [])

  const clearLocalStorage = useCallback(() => {
    appInitStore.getState().clearLocalStorage()
    // Refresh localStorage info
    setLocalStorageInfo(appInitStore.getState().getLocalStorageInfo())
    // Force a page reload to reset the state
    window.location.reload()
  }, [])

  const refreshLocalStorageInfo = useCallback(() => {
    setLocalStorageInfo(appInitStore.getState().getLocalStorageInfo())
  }, [])

  useEffect(() => {
    console.log(`Render App.tsx [isFirstAppLaunch=${isFirstAppLaunch}|initStage=${initStage}|startType=${startType}|appSessionId=${appSessionId}]`)
    // Initialize first launch detection
    const lastStartTs = appInitStore.getState().lastStartupTimestamp;
    if (!lastStartTs) {
      appInitStore.getState().initializeFirstLaunch()
    }
    // Get localStorage info
    setLocalStorageInfo(appInitStore.getState().getLocalStorageInfo())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const completedTodos = Object.values(todos).filter(todo => todo.done).length
  const totalTodos = Object.values(todos).length
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  const appInitProgressPercentage = AppInitStageProgression[initStage].percent
  const appInitProgressDescription = AppInitStageProgression[initStage].description

  return (
    <>
      <Container fluid className="py-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col xs={12} className="text-center mb-3">
            <h1 className="display-4 fw-bold text-primary mb-2">Zustand + Immer Demo</h1>
            <p className="lead text-muted">Application Initialization & State Management Dashboard</p>
          </Col>
        </Row>

        <Row className="g-4 p-1 mb-2 bg-info-subtle text-white">
          <Col xs={12} className="text-center">
            <p className="h3">
              {appInitProgressDescription}
              {' '}
              <em>{`(${appInitProgressPercentage}% Complete)`}</em>
            </p>
            <ProgressBar
              now={appInitProgressPercentage}
              className="mb-4 p-1"
              style={{ height: 45 }}
              variant="info"
              animated
              striped
            />
          </Col>
        </Row>

        <Row className="g-4 p-1">
          {/* App Init Status Section */}
          <Col lg={4}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <p className="h3 card-title mb-0">
                  ⚡ AppInit Process Metadata
                </p>
              </Card.Header>
              <Card.Body>
                {/* Control Buttons */}
                <div className="d-grid gap-2 mb-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleIsFirstAppLaunch()}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Toggle IsFirstAppLaunch
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleSessionStartupType()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Toggle Startup Type
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    onClick={() => setExternalUserId()}
                  >
                    <i className="bi bi-person-badge me-2"></i>
                    Set External User ID
                  </Button>
                </div>

                <hr />

                {/* Status Information */}
                <Row className="g-3">
                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">Current Stage:</span>
                      <Badge bg="info" className="fs-6">{initStage}</Badge>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">Session Startup Type:</span>
                      <Badge
                        bg={startType === SessionStartupType.WARM_START ? 'warning' : 'primary'}
                        className="fs-6"
                      >
                        {startType}
                      </Badge>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">Is First Time App Launched?</span>
                      <Badge
                        bg={isFirstAppLaunch ? 'success' : 'danger'}
                        className="fs-6"
                      >
                        {isFirstAppLaunch ? 'True' : 'False'}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                {/* localStorage Persistence Info */}
                <Alert variant="info" className="mt-3">
                  <i className="bi bi-database me-2"></i>
                  <strong>localStorage Persistence:</strong> This state is automatically saved to your browser's localStorage and will persist between sessions.
                </Alert>

                {/* localStorage Management */}
                <Card className="mt-3">
                  <Card.Header className="bg-secondary text-white">
                    <p className="h6 card-title mb-0">
                      <i className="bi bi-gear me-2"></i>
                      localStorage Management
                    </p>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold">Status:</span>
                        <Badge bg={localStorageInfo.hasData ? 'success' : 'warning'}>
                          {localStorageInfo.hasData ? 'Data Stored' : 'No Data'}
                        </Badge>
                      </div>
                      {localStorageInfo.hasData && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Size:</span>
                            <span className="text-muted">{localStorageInfo.dataSize} bytes</span>                          
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Last App Launch:</span>
                            <span className="text-muted">{localStorageInfo.lastStartupTimestamp}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={refreshLocalStorageInfo}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh Info
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={clearLocalStorage}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Clear localStorage & Reset
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header className="bg-primary text-white">
                <p className="h3 card-title mb-0">
                  🥸 Session Identity Details
                </p>
              </Card.Header>
              <Card.Body>
              <Row className="g-3">
                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">App Session ID:</span>
                      <Badge bg="info" className="fs-6">
                        {appSessionId}
                      </Badge>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">Anonymous ID:</span>
                      <Badge bg="info" className="fs-6">
                        {anonymousId}
                      </Badge>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <span className="fw-semibold">External Device Session ID:</span>
                      <Badge bg="info" className="fs-6">
                        {externalDeviceSessionId}
                      </Badge>
                    </div>
                  </Col>

                  {/* External User ID Status */}
                  <Col xs={12}>
                    <div className={`d-flex justify-content-between align-items-center p-3 rounded ${externalUserId ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
                      <span className="fw-semibold">External User ID:</span>
                      <Badge
                        bg={externalUserId ? 'success' : 'info'}
                        className="fs-6"
                      >
                        {externalUserId || 'Not Set'}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>            
          </Col>

          {/* Todo List Section */}
          <Col lg={4}>
            <Card className="shadow h-100">
              <Card.Header className="bg-success text-white">
                <p className="h3 card-title mb-0">
                  <i className="bi bi-clipboard-check me-2"></i>
                  ✅ Learning Tasks
                </p>
              </Card.Header>
              <Card.Body>
                {/* Todo Items */}
                <div className="mb-4">
                  {Object.values(todos).map(todo => (
                    <div
                      key={todo.id}
                      className={`d-flex align-items-center p-3 mb-2 rounded border ${todo.done
                        ? 'bg-success bg-opacity-10 border-success'
                        : 'bg-light border-light'
                      }`}
                    >
                      <Form.Check
                        className="me-3"
                        type="switch"
                        checked={todo.done}
                        onChange={() => toggleTodo(todo.id)}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                      />
                      <span className={`fs-5 ${todo.done ? 'text-success text-decoration-line-through' : 'text-dark'}`}>
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-white">Task Progress</span>
                    <span className="fw-semibold text-white">
                      {completedTodos}
                      {' '}
                      /
                      {totalTodos}
                    </span>
                  </div>
                  <ProgressBar
                    now={progressPercentage}
                    variant="primary"
                    style={{ height: '1.5rem' }}
                    label={`${Math.round(progressPercentage)}%`}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Users Section */}
          <Col lg={4}>
            <Card className="shadow h-100">
              <Card.Header className="bg-info text-white">
                <p className="h3 card-title mb-0">
                  <i className="bi bi-people me-2"></i>
                  🛜 Fetched Users
                </p>
              </Card.Header>
              <Card.Body>
                {/* Control Button */}
                <div className="d-grid gap-2 mb-4">
                  <Button
                    variant="info"
                    size="lg"
                    onClick={() => fetchUsers()}
                    disabled={isLoadingUsers}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    {isLoadingUsers ? 'Loading...' : 'Refresh Users'}
                  </Button>
                </div>

                <hr />

                {/* External User ID Info */}
                {externalUserId && (
                  <Alert variant="success" className="mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>External User ID Set!</strong>
                    {' '}
                    The Zustand subscription has triggered and axios interceptors will now include the
                    <code>X-External-User-Id</code>
                    {' '}
                    header in all requests.
                  </Alert>
                )}

                {/* Users Display */}
                <div className="mb-4">
                  {isLoadingUsers
                    ? (
                        <div className="text-center p-4">
                          <Spinner animation="border" variant="info" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                          <p className="mt-2 text-muted">Fetching users...</p>
                        </div>
                      )
                    : users.length > 0
                      ? (
                          users.map((user, index) => (
                            <div
                              key={user.userId || index}
                              className="d-flex align-items-center p-3 mb-2 rounded border bg-light"
                            >
                              <div className="me-3">
                                <Image
                                  src={user.avatar}
                                  alt={`${user.username} avatar`}
                                  roundedCircle
                                  style={{ width: '3rem', height: '3rem' }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-bold">{user.username}</h6>
                                <p className="mb-1 text-muted small">{user.email}</p>
                                <p className="mb-0 text-muted small">
                                  Registered:
                                  {' '}
                                  {new Date(user.registeredAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )
                      : (
                          <div className="text-center p-4 text-muted">
                            <i className="bi bi-people fs-1 mb-3"></i>
                            <p>No users loaded. Click "Refresh Users" to fetch data.</p>
                          </div>
                        )}
                </div>

                {/* Users Summary */}
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-info">Total Users</span>
                    <Badge bg="info" className="fs-6">
                      {users.length}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
