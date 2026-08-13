-- MapNG Spawn System
-- BeamNG.drive GELUA

local M = {}

local spawnPoints = {
  {
    name = "Main Spawn",
    position = vec3(0, 0, 0),
    rotation = quat(0, 0, 0, 1)
  },

  {
    name = "Spawn 2",
    position = vec3(50, 0, 0),
    rotation = quat(0, 0, 0, 1)
  },

  {
    name = "Spawn 3",
    position = vec3(-50, 0, 0),
    rotation = quat(0, 0, 0, 1)
  }
}

local function getPlayer()
  return getPlayerVehicle(0)
end

local function getGroundPosition(position)
  local start = vec3(
    position.x,
    position.y,
    position.z + 1000
  )

  local finish = vec3(
    position.x,
    position.y,
    position.z - 1000
  )

  local result = Engine.castRay(
    start,
    finish,
    true,
    true
  )

  if result and result.pt then
    return result.pt
  end

  return position
end

function M.spawnPlayer(index)
  local vehicle = getPlayer()

  if not vehicle then
    log(
      "E",
      "MapNGSpawn",
      "Player vehicle not found"
    )

    return false
  end

  local spawn = spawnPoints[index or 1]

  if not spawn then
    log(
      "E",
      "MapNGSpawn",
      "Invalid spawn point: " .. tostring(index)
    )

    return false
  end

  local ground = getGroundPosition(
    spawn.position
  )

  local finalPosition = vec3(
    ground.x,
    ground.y,
    ground.z + 1.0
  )

  vehicle:setPositionNoPhysicsReset(
    finalPosition
  )

  vehicle:setRotation(
    spawn.rotation
  )

  log(
    "I",
    "MapNGSpawn",
    "Player spawned at " ..
    tostring(spawn.name)
  )

  return true
end

function M.getSpawnPoints()
  return spawnPoints
end

function M.addSpawnPoint(
  name,
  position,
  rotation
)
  table.insert(
    spawnPoints,
    {
      name = name or "Unnamed Spawn",
      position = position,
      rotation = rotation or quat(0, 0, 0, 1)
    }
  )
end

function M.clearSpawnPoints()
  spawnPoints = {}
end

return M
