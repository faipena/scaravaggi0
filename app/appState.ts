class AppState {
  private static instance: AppState;
  public isLive: boolean = false;

  private constructor() {
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }
}

export default AppState.getInstance();
