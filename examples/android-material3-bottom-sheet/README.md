# Material 3 半屏 Bottom Sheet（Android Compose）

在 Android Studio 中新建 **Empty Activity (Compose)** 项目后，用下面代码替换对应文件即可运行。

## 关键 API

- `ModalBottomSheet`：M3 模态底部抽屉
- `rememberModalBottomSheetState(skipPartiallyExpanded = false)`：支持半屏停靠
- `SheetValue.PartiallyExpanded`：半展开状态（约 50% 屏高）
- `SheetValue.Expanded`：继续上拉可全屏

## MainActivity.kt

```kotlin
package com.example.bottomsheetdemo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.example.bottomsheetdemo.ui.BottomSheetDemoScreen
import com.example.bottomsheetdemo.ui.theme.BottomSheetDemoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BottomSheetDemoTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    BottomSheetDemoScreen()
                }
            }
        }
    }
}
```

## BottomSheetDemoScreen.kt

```kotlin
package com.example.bottomsheetdemo.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomSheetDemoScreen() {
    var showSheet by remember { mutableStateOf(false) }

    // false = 允许停在 PartiallyExpanded（半屏）
    val sheetState = rememberModalBottomSheetState(
        skipPartiallyExpanded = false,
    )
    val scope = rememberCoroutineScope()

    Column(Modifier.padding(24.dp)) {
        Text(
            text = "Material 3 半屏抽屉",
            style = MaterialTheme.typography.headlineSmall,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = "打开后默认半屏，继续上拉可到全屏，下拉可关闭。",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(16.dp))
        Button(onClick = { showSheet = true }) {
            Text("打开半屏抽屉")
        }
    }

    if (showSheet) {
        ModalBottomSheet(
            onDismissRequest = {
                showSheet = false
            },
            sheetState = sheetState,
            // 系统会自动绘制 M3 Drag Handle
        ) {
            Column(Modifier.padding(horizontal = 24.dp)) {
                Text(
                    text = "选择播放列表",
                    style = MaterialTheme.typography.titleLarge,
                )
                Text(
                    text = when (sheetState.currentValue) {
                        SheetValue.PartiallyExpanded -> "当前：半屏"
                        SheetValue.Expanded -> "当前：全屏"
                        else -> ""
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(16.dp))
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp),
            ) {
                items(PLAYLISTS) { name ->
                    Text(
                        text = name,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }
                item { Spacer(Modifier.height(32.dp)) }
            }
        }
    }
}

private val PLAYLISTS = listOf(
    "通勤 Lo-Fi",
    "晨跑 120 BPM",
    "深夜爵士",
    "学习专注",
    "周末 House",
    "开车公路歌单",
    "雨天窗边",
    "派对热身",
)
```

## build.gradle.kts（Module）依赖

```kotlin
dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.9.3")
}
```

## 与 Web Demo 的对应关系

| M3 规范 | Web Demo (`demo.html`) | Compose |
|---------|------------------------|---------|
| 半屏高度 | `max-height: 50vh` | `skipPartiallyExpanded = false` |
| 顶圆角 28dp | `border-radius: 28px` | 系统默认 |
| Scrim 32% | `opacity: 0.32` | 系统默认 |
| Drag Handle | 顶部横条 | `ModalBottomSheet` 自带 |
| 拖拽关闭 | 自定义 pointer 事件 | `sheetState` 手势内置 |
