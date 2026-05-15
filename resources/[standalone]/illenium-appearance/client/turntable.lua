local client = client
local w2fTurntableActive = false
local w2fTimecycleActive = false

local function enableW2FPreviewLighting()
    if w2fTimecycleActive or not Config.W2FPreview or not Config.W2FPreview.Timecycle then return end

    SetTimecycleModifier(Config.W2FPreview.TimecycleModifier or "superDARK")
    SetTimecycleModifierStrength(Config.W2FPreview.TimecycleStrength or 0.6)
    w2fTimecycleActive = true
end

local function disableW2FPreviewLighting()
    if not w2fTimecycleActive then return end

    ClearTimecycleModifier()
    w2fTimecycleActive = false
end

function client.startTurntable()
    if w2fTurntableActive or not Config.W2FPreview or not Config.W2FPreview.Turntable then
        enableW2FPreviewLighting()
        return
    end

    w2fTurntableActive = true
    enableW2FPreviewLighting()

    CreateThread(function()
        while w2fTurntableActive do
            if cache.ped and DoesEntityExist(cache.ped) then
                client.pedTurn(cache.ped, 0.4)
            end

            Wait(60)
        end
    end)
end

function client.stopTurntable()
    w2fTurntableActive = false
    disableW2FPreviewLighting()
end

RegisterNUICallback("appearance_turntable_start", function(_, cb)
    client.startTurntable()
    cb({ ok = true })
end)

RegisterNUICallback("appearance_turntable_stop", function(_, cb)
    client.stopTurntable()
    cb({ ok = true })
end)

AddEventHandler("onResourceStop", function(resource)
    if resource ~= GetCurrentResourceName() then return end
    client.stopTurntable()
end)
