// localStorage keys
const KEYS = {
  USERS: 'ls_users',
  PROFILES: 'ls_profiles',
  PLANS: 'ls_plans',
  FEEDBACKS: 'ls_feedbacks',
  CURRENT_USER: 'ls_current_user',
}

export function getStore(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getCurrentUserId() {
  const user = getStore(KEYS.CURRENT_USER)
  return user?._id || null
}

// ── Seed demo data on first load ────────────────────────────────────────────

const SEED_VERSION = 2
const DEMO_USER_ID = 'demo_user_001'
const DEMO_PLAN_IDS = ['plan_demo_001', 'plan_demo_002', 'plan_demo_003']

function seedIfNeeded() {
  const currentVersion = getStore('ls_seed_version')
  if (currentVersion === SEED_VERSION) return
  // Clear stale data from previous version
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  setStore('ls_seed_version', SEED_VERSION)

  const demoUser = {
    _id: DEMO_USER_ID,
    email: 'demo@accessplanner.com',
    password: 'Demo1234',
    full_name: 'Abhishek Verma',
    role: 'admin',
    is_active: true,
    created_at: '2026-04-01T10:00:00.000Z',
  }
  setStore(KEYS.USERS, [demoUser])

  const demoProfile = {
    _id: 'profile_demo_001',
    user_id: DEMO_USER_ID,
    disabilities: [
      { type: 'mobility', severity: 'moderate', specific_needs: 'Wheelchair user, needs ramp access' },
      { type: 'visual', severity: 'mild', specific_needs: 'Low vision, prefers high contrast' },
    ],
    preferences: {
      preferred_transport: 'public',
      max_walking_distance: 300,
      companion_needed: false,
      plan_format: 'detailed',
      voice_input: false,
      high_contrast: true,
      font_size: 'large',
    },
    location: { city: 'Mumbai', default_address: 'Andheri West, Mumbai' },
    created_at: '2026-04-01T10:05:00.000Z',
    updated_at: '2026-04-01T10:05:00.000Z',
  }
  setStore(KEYS.PROFILES, [demoProfile])

  const demoPlans = [
    {
      _id: DEMO_PLAN_IDS[0],
      user_id: DEMO_USER_ID,
      activity_input: {
        description: 'Visit City General Hospital for a routine checkup',
        activity_type: 'medical',
        date: '2026-04-20',
        time: '09:00 - 12:00',
        destination: 'City General Hospital, Main Street',
      },
      generated_plan: buildPlanForType('medical', {
        description: 'Visit City General Hospital for a routine checkup',
        destination: 'City General Hospital, Main Street',
        date: '2026-04-20',
      }),
      ai_model_used: 'mock-local',
      generation_time_ms: 820,
      created_at: '2026-04-15T08:30:00.000Z',
    },
    {
      _id: DEMO_PLAN_IDS[1],
      user_id: DEMO_USER_ID,
      activity_input: {
        description: 'Daily commute from home to office',
        activity_type: 'commute',
        date: '2026-04-16',
        time: '08:00 - 09:00',
        destination: 'Bandra Kurla Complex, Mumbai',
      },
      generated_plan: buildPlanForType('commute', {
        description: 'Daily commute from home to office',
        destination: 'Bandra Kurla Complex, Mumbai',
        date: '2026-04-16',
      }),
      ai_model_used: 'mock-local',
      generation_time_ms: 650,
      created_at: '2026-04-14T07:00:00.000Z',
    },
    {
      _id: DEMO_PLAN_IDS[2],
      user_id: DEMO_USER_ID,
      activity_input: {
        description: 'Grocery shopping at the local market',
        activity_type: 'shopping',
        date: '2026-04-18',
        time: '10:00 - 12:00',
        destination: 'Phoenix Mall, Lower Parel',
      },
      generated_plan: buildPlanForType('shopping', {
        description: 'Grocery shopping at the local market',
        destination: 'Phoenix Mall, Lower Parel',
        date: '2026-04-18',
      }),
      ai_model_used: 'mock-local',
      generation_time_ms: 710,
      created_at: '2026-04-12T09:15:00.000Z',
    },
  ]
  setStore(KEYS.PLANS, demoPlans)

  const demoFeedback = {
    _id: 'fb_demo_001',
    plan_id: DEMO_PLAN_IDS[0],
    user_id: DEMO_USER_ID,
    rating: 4,
    thumbs: 'up',
    comment: 'Very helpful plan! The wheelchair route suggestions were accurate.',
    created_at: '2026-04-15T12:00:00.000Z',
  }
  setStore(KEYS.FEEDBACKS, [demoFeedback])
}

seedIfNeeded()

// ── Plan templates ──────────────────────────────────────────────────────────

const PLAN_TEMPLATES = {
  medical: {
    title: 'Accessible Hospital Visit Plan',
    summary: 'A step-by-step plan for your medical appointment, optimized for wheelchair accessibility and visual impairment support.',
    steps: [
      {
        step_number: 1,
        title: 'Prepare for departure',
        description: 'Pack your mobility aids and ensure your phone is charged for navigation assistance. Carry hospital documents in a tactile-labeled folder.',
        time_estimate: '15 minutes',
        accessibility_notes: 'Use a high-contrast, large-print checklist. Ensure wheelchair is fully charged if electric.',
        tools_needed: ['Wheelchair', 'Phone with screen reader', 'Document folder'],
      },
      {
        step_number: 2,
        title: 'Travel to hospital',
        description: 'Take the accessible bus route from your nearest stop. The bus has a wheelchair ramp and audio announcements.',
        time_estimate: '30 minutes',
        accessibility_notes: 'Bus stop has tactile paving. Request ramp deployment from the driver. Audio announcements are available.',
        tools_needed: ['Transit pass', 'Headphones for audio navigation'],
      },
      {
        step_number: 3,
        title: 'Arrive and check in',
        description: 'Enter through the accessible entrance on the ground floor. The reception desk has a lowered counter for wheelchair users.',
        time_estimate: '10 minutes',
        accessibility_notes: 'Ask for large-print forms if needed. Reception has an induction loop for hearing aids.',
        tools_needed: ['Hospital ID', 'Insurance card'],
      },
      {
        step_number: 4,
        title: 'Attend appointment',
        description: 'Wait in the designated accessible seating area. Staff will call you when the doctor is ready.',
        time_estimate: '45 minutes',
        accessibility_notes: 'Inform staff of any communication preferences. Visual display boards show queue numbers.',
        tools_needed: ['Medical history document'],
      },
      {
        step_number: 5,
        title: 'Return home',
        description: 'Use the same accessible route to return. Consider a ride-share if fatigued from the visit.',
        time_estimate: '30 minutes',
        accessibility_notes: 'Book accessible taxi via ride-share app if bus feels too tiring after the appointment.',
        tools_needed: ['Phone', 'Transit pass or ride-share app'],
      },
    ],
    alternatives: [
      { title: 'Accessible taxi service', description: 'Book a wheelchair-accessible taxi for door-to-door service.', trade_offs: 'More expensive but eliminates transit navigation entirely.' },
      { title: 'Telehealth option', description: 'Check if the hospital offers video consultations for follow-ups.', trade_offs: 'Not suitable for physical examinations.' },
    ],
    recommended_tools: ['Google Maps (accessibility mode)', 'AccessRide App', 'Hospital accessibility guide', 'Magnifying app for reading prescriptions'],
    weather_advisory: 'Clear skies expected. No weather-related adjustments needed.',
  },

  commute: {
    title: 'Accessible Daily Commute Plan',
    summary: 'An optimized daily commute plan with wheelchair-accessible routes and audio navigation support.',
    steps: [
      {
        step_number: 1,
        title: 'Morning preparation',
        description: 'Check real-time transit status for your route. Ensure all mobility aids are ready.',
        time_estimate: '10 minutes',
        accessibility_notes: 'Use voice assistant to check bus/train status hands-free.',
        tools_needed: ['Phone with transit app', 'Wheelchair'],
      },
      {
        step_number: 2,
        title: 'Walk to transit stop',
        description: 'Follow the accessible pedestrian route to the nearest bus stop (200m, paved sidewalk with curb cuts).',
        time_estimate: '8 minutes',
        accessibility_notes: 'Route has tactile paving and audible pedestrian signals at crossings.',
        tools_needed: ['Navigation app with accessibility mode'],
      },
      {
        step_number: 3,
        title: 'Board accessible transit',
        description: 'Board the accessible bus/train. Priority seating is available near the front entrance.',
        time_estimate: '25 minutes',
        accessibility_notes: 'Wheelchair ramp available on request. Audio announcements for all stops.',
        tools_needed: ['Transit pass', 'Headphones'],
      },
      {
        step_number: 4,
        title: 'Arrive at destination',
        description: 'Exit at your stop and follow the accessible path to your workplace entrance.',
        time_estimate: '5 minutes',
        accessibility_notes: 'Building has automatic doors and elevator access to all floors.',
        tools_needed: ['Access card/badge'],
      },
    ],
    alternatives: [
      { title: 'Ride-share commute', description: 'Use an accessible ride-share for days when transit is disrupted.', trade_offs: 'Higher cost but more reliable timing.' },
      { title: 'Flexible timing', description: 'Travel 30 minutes earlier to avoid peak crowd congestion.', trade_offs: 'Earlier wake-up but significantly less crowded routes.' },
    ],
    recommended_tools: ['City Transit App', 'Google Maps (wheelchair routes)', 'Ride-share accessibility app'],
    weather_advisory: 'Check weather before departure. Carry rain cover for wheelchair during monsoon season.',
  },

  shopping: {
    title: 'Accessible Shopping Trip Plan',
    summary: 'A comfortable shopping experience with accessibility-optimized route and venue recommendations.',
    steps: [
      {
        step_number: 1,
        title: 'Plan your shopping list',
        description: 'Prepare a shopping list organized by store sections to minimize movement.',
        time_estimate: '10 minutes',
        accessibility_notes: 'Use a voice-to-text app to create the list hands-free. Save in large font for easy reading.',
        tools_needed: ['Phone with notes app', 'Voice assistant'],
      },
      {
        step_number: 2,
        title: 'Travel to shopping venue',
        description: 'Take accessible transport to the mall. Accessible parking is available near the main entrance.',
        time_estimate: '20 minutes',
        accessibility_notes: 'Drop-off point is near the wheelchair-accessible entrance. Ramp access available.',
        tools_needed: ['Transit pass or ride-share app'],
      },
      {
        step_number: 3,
        title: 'Navigate the venue',
        description: 'Use the mall directory to locate stores. Elevators are available near the food court.',
        time_estimate: '60 minutes',
        accessibility_notes: 'Wide aisles on ground floor. Staff assistance available at the information desk. Rest areas with seating every 50m.',
        tools_needed: ['Shopping list', 'Magnifying app for labels'],
      },
      {
        step_number: 4,
        title: 'Checkout and return',
        description: 'Use priority checkout lanes where available. Staff can assist with packing.',
        time_estimate: '15 minutes',
        accessibility_notes: 'Contactless payment recommended for ease. Request carry-out assistance if needed.',
        tools_needed: ['Payment card/phone', 'Shopping bags'],
      },
    ],
    alternatives: [
      { title: 'Online grocery delivery', description: 'Use an accessible grocery delivery app for home delivery.', trade_offs: 'Cannot inspect items physically but saves significant energy.' },
      { title: 'Personal shopping assistant', description: 'Some stores offer free personal shopper services for people with disabilities.', trade_offs: 'May need to book 24 hours in advance.' },
    ],
    recommended_tools: ['Store accessibility map', 'Voice-to-text shopping list app', 'Magnifying app for product labels'],
    weather_advisory: 'Indoor venue — weather has minimal impact. Ensure accessible transport for the return trip.',
  },

  event: {
    title: 'Accessible Event Attendance Plan',
    summary: 'A detailed plan for attending an event with full accessibility considerations.',
    steps: [
      {
        step_number: 1,
        title: 'Pre-event preparation',
        description: 'Contact the event venue to confirm accessibility features. Register for any required accessibility services.',
        time_estimate: '20 minutes',
        accessibility_notes: 'Ask about wheelchair seating, sign language interpreters, and hearing loop availability.',
        tools_needed: ['Phone', 'Event ticket/confirmation'],
      },
      {
        step_number: 2,
        title: 'Travel to the venue',
        description: 'Use accessible transport. Arrive 30 minutes early to allow time for accessible entry.',
        time_estimate: '35 minutes',
        accessibility_notes: 'Venue drop-off point is at the accessible entrance on the south side.',
        tools_needed: ['Transit pass', 'Wheelchair', 'Phone with navigation'],
      },
      {
        step_number: 3,
        title: 'Enter and settle in',
        description: 'Use the accessible entrance and find your designated seating area. Staff will guide you.',
        time_estimate: '15 minutes',
        accessibility_notes: 'Accessible restrooms are located near the main hall entrance.',
        tools_needed: ['Event ticket', 'ID'],
      },
      {
        step_number: 4,
        title: 'Enjoy the event and depart',
        description: 'After the event, use the accessible exit. Consider leaving 10 minutes early to avoid crowds.',
        time_estimate: '15 minutes',
        accessibility_notes: 'Accessible exit avoids stairs. Staff available for assistance at all exits.',
        tools_needed: ['Phone for ride-share booking'],
      },
    ],
    alternatives: [
      { title: 'Live stream', description: 'Watch a live stream of the event from home if available.', trade_offs: 'Misses the in-person experience but zero accessibility barriers.' },
    ],
    recommended_tools: ['Venue accessibility map', 'Hearing loop app', 'Ride-share app'],
    weather_advisory: 'If outdoor event, bring sun protection and extra water. Check for covered accessible seating.',
  },

  daily_routine: {
    title: 'Accessible Daily Routine Plan',
    summary: 'A structured daily plan with accessibility accommodations for independent living.',
    steps: [
      {
        step_number: 1,
        title: 'Morning routine',
        description: 'Follow your adapted morning routine with assistive tools for grooming and dressing.',
        time_estimate: '45 minutes',
        accessibility_notes: 'Use grab bars in bathroom. Laid-out clothing from the night before saves time.',
        tools_needed: ['Grab bars', 'Adaptive clothing aids', 'Voice assistant for reminders'],
      },
      {
        step_number: 2,
        title: 'Breakfast and medication',
        description: 'Prepare breakfast using accessible kitchen setup. Take scheduled medications.',
        time_estimate: '30 minutes',
        accessibility_notes: 'Keep frequently used items at wheelchair-accessible height. Use talking medication reminder.',
        tools_needed: ['Adaptive kitchen tools', 'Medication organizer', 'Timer/alarm'],
      },
      {
        step_number: 3,
        title: 'Daytime activities',
        description: 'Engage in planned activities with scheduled rest breaks every 90 minutes.',
        time_estimate: '4 hours',
        accessibility_notes: 'Alternate between active and resting tasks. Keep hydration within reach at all times.',
        tools_needed: ['Activity planner', 'Water bottle', 'Phone for reminders'],
      },
      {
        step_number: 4,
        title: 'Evening wind-down',
        description: 'Prepare for the next day. Light stretching, medication, and rest.',
        time_estimate: '1 hour',
        accessibility_notes: 'Use night mode on all devices. Ensure bedroom is clear of obstacles for safe navigation.',
        tools_needed: ['Night light', 'Medication organizer', 'Adaptive alarm clock'],
      },
    ],
    alternatives: [
      { title: 'Caregiver-assisted routine', description: 'Schedule a caregiver for morning and evening routines.', trade_offs: 'Less independence but more safety for complex tasks.' },
    ],
    recommended_tools: ['Voice assistant (Alexa/Google)', 'Adaptive daily living aids', 'Medication management app'],
    weather_advisory: 'Stay hydrated during warm days. Adjust indoor temperature for comfort.',
  },

  custom: {
    title: 'Custom Accessibility Plan',
    summary: 'A personalized accessibility plan tailored to your specific activity and needs.',
    steps: [
      {
        step_number: 1,
        title: 'Activity preparation',
        description: 'Review the activity requirements and prepare necessary assistive tools and documents.',
        time_estimate: '15 minutes',
        accessibility_notes: 'Check venue/location accessibility features in advance. Call ahead if unsure.',
        tools_needed: ['Phone', 'Required documents', 'Mobility aids'],
      },
      {
        step_number: 2,
        title: 'Travel planning',
        description: 'Plan an accessible route to and from the destination using your preferred transport.',
        time_estimate: '20 minutes',
        accessibility_notes: 'Confirm wheelchair accessibility of transport and destination entrance.',
        tools_needed: ['Navigation app', 'Transit pass'],
      },
      {
        step_number: 3,
        title: 'Perform activity',
        description: 'Engage in the planned activity. Take breaks as needed and ask for assistance when required.',
        time_estimate: '1-2 hours',
        accessibility_notes: 'Locate accessible restrooms and rest areas upon arrival. Keep emergency contacts accessible.',
        tools_needed: ['Activity-specific items', 'Water', 'Phone'],
      },
      {
        step_number: 4,
        title: 'Return and rest',
        description: 'Use accessible transport to return home. Allow time for rest after the activity.',
        time_estimate: '30 minutes',
        accessibility_notes: 'Book return transport before leaving if using ride-share to avoid wait times.',
        tools_needed: ['Phone', 'Transit pass or ride-share app'],
      },
    ],
    alternatives: [
      { title: 'Virtual alternative', description: 'Explore if the activity can be done remotely or online.', trade_offs: 'Reduces physical barriers but may limit the experience.' },
      { title: 'Companion support', description: 'Bring a companion or request venue assistance.', trade_offs: 'More support available but requires coordination.' },
    ],
    recommended_tools: ['Accessibility checker app', 'Navigation app', 'Emergency contact card'],
    weather_advisory: 'Check weather conditions and plan accordingly. Carry appropriate gear for outdoor activities.',
  },
}

export function buildPlanForType(activityType, userInput = {}) {
  const template = PLAN_TEMPLATES[activityType] || PLAN_TEMPLATES.custom
  return {
    ...template,
    title: userInput.description
      ? `Accessible Plan: ${userInput.description.slice(0, 60)}`
      : template.title,
    activity_type: activityType,
    generated_at: new Date().toISOString(),
    generation_note: 'This plan was generated locally for demonstration purposes.',
    ...(userInput.destination && {
      route_info: { destination: userInput.destination, note: 'Route data available when Maps API is configured.' },
    }),
    ...(userInput.date && {
      weather_info: { date: userInput.date, note: 'Real-time weather data available when Weather API is configured.' },
    }),
  }
}

export { KEYS }
