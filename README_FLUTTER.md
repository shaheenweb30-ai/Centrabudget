# CentraBudget Flutter App

A beautiful, responsive Flutter implementation of the CentraBudget dashboard that mirrors the web version's functionality and design.

## 🚀 Features

- **Responsive Dashboard**: Beautiful gradient-based design that works on all screen sizes
- **Financial Metrics**: Real-time calculation of balance, income, expenses, and budget progress
- **Smart Empty States**: Context-aware messaging for new users vs. existing users
- **Modern UI Components**: Custom widgets with Material Design 3 principles
- **Mock Data**: Sample transactions and categories to demonstrate functionality
- **Gradient Design**: Consistent with your web app's blue-to-purple gradient theme

## 📱 Screenshots

The app includes:
- **Welcome Banner**: For new users with setup guidance
- **Metrics Grid**: 4 key financial indicators in a responsive grid
- **Top Categories**: Spending analysis by budget category
- **Recent Transactions**: Latest financial activity
- **Empty States**: Helpful guidance when no data exists

## 🛠️ Setup Instructions

### Prerequisites
- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code with Flutter extensions
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Clone the project** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd Centrabudget-1
   ```

2. **Navigate to the Flutter project**:
   ```bash
   cd lib
   ```

3. **Install dependencies**:
   ```bash
   flutter pub get
   ```

4. **Run the app**:
   ```bash
   flutter run
   ```

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#2563EB) to Purple (#7C3AED) gradients
- **Success**: Green (#10B981) for income/positive values
- **Warning**: Red (#EF4444) for expenses/negative values
- **Accent**: Orange (#F59E0B) for budget progress

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: Regular, Medium, SemiBold, Bold
- **Responsive**: Scales appropriately for different screen sizes

### Components
- **Metric Cards**: Glassmorphism effect with gradients
- **Empty States**: Contextual guidance with call-to-action buttons
- **List Items**: Clean, organized transaction and category displays
- **Navigation**: SliverAppBar with gradient background

## 🔧 Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── transaction.dart     # Transaction entity
│   └── category.dart        # Budget category entity
├── screens/                  # Main screens
│   └── dashboard_screen.dart # Dashboard implementation
├── widgets/                  # Reusable components
│   ├── metric_card.dart     # Financial metric display
│   ├── empty_state_card.dart # Empty state guidance
│   ├── transaction_list_item.dart # Transaction row
│   └── category_list_item.dart   # Category row
└── utils/                    # Utilities
    └── currency_formatter.dart # Currency formatting
```

## 🚀 Running the App

### Development Mode
```bash
flutter run
```

### Release Mode
```bash
flutter run --release
```

### Hot Reload
Press `r` in the terminal while running to hot reload changes.

## 📱 Platform Support

- ✅ **Android**: Full support with Material Design
- ✅ **iOS**: Full support with iOS-specific optimizations
- ✅ **Web**: Responsive web support (Flutter Web)
- ✅ **Desktop**: Windows, macOS, Linux support

## 🔮 Future Enhancements

This Flutter implementation provides a solid foundation for:

- **State Management**: Integration with Provider, Bloc, or Riverpod
- **Backend Integration**: Supabase/API connectivity
- **Authentication**: User login/signup flows
- **Navigation**: Multi-screen app with routing
- **Data Persistence**: Local storage and sync
- **Push Notifications**: Budget alerts and reminders
- **Charts**: Interactive financial visualizations

## 🎯 Key Benefits

1. **Performance**: Native compilation for smooth 60fps animations
2. **Consistency**: Same codebase for iOS and Android
3. **Maintainability**: Clean, organized Flutter architecture
4. **Scalability**: Easy to add new features and screens
5. **User Experience**: Smooth, responsive interface matching your web design

## 🤝 Contributing

The Flutter implementation follows Flutter best practices:
- **Widget Composition**: Reusable, composable components
- **State Management**: Clean separation of concerns
- **Performance**: Efficient rendering and memory usage
- **Accessibility**: Screen reader and navigation support

---

**Ready to see your CentraBudget dashboard in Flutter?** Run `flutter run` and experience the smooth, native mobile experience! 🚀
