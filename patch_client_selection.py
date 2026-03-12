import re

with open('frontend/src/pages/ClientSelection.tsx', 'r') as f:
    content = f.read()

# Add states for modal
modal_states = """  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);"""

content = content.replace("  const [isCheckingIn, setIsCheckingIn] = useState(false);", "  const [isCheckingIn, setIsCheckingIn] = useState(false);\n" + modal_states)

# Modify handleClientSelect to just show modal
old_handle_select = """  const handleClientSelect = async (client: Client) => {
    setIsCheckingIn(true);
    try {
      const location = await getCurrentLocation();"""

new_handle_select = """  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setShowConfirmModal(true);
  };

  const confirmCheckIn = async () => {
    if (!selectedClient) return;
    const client = selectedClient;
    setIsCheckingIn(true);
    setShowConfirmModal(false);
    try {
      const location = await getCurrentLocation();"""

content = content.replace(old_handle_select, new_handle_select)

# Add Modal HTML at end of return block
modal_html = """
      {/* Confirmation Modal */}
      {showConfirmModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-background-dark rounded-xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm Check-In</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to check in to <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedClient.name}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCheckIn}
                  className="flex-1 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
"""

# Inject before last div and BottomNav
content = content.replace("      </div>\n    </div>\n  );\n}", modal_html + "\n      </div>\n    </div>\n  );\n}")

with open('frontend/src/pages/ClientSelection.tsx', 'w') as f:
    f.write(content)
