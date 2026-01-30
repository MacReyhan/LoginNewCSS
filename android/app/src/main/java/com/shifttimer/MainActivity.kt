package com.shifttimer

import android.app.TimePickerDialog
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import kotlinx.coroutines.delay
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import kotlin.math.abs

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Handle the splash screen transition.
        installSplashScreen()
        
        super.onCreate(savedInstanceState)
        setContent {
            ShiftTimerApp()
        }
    }
}

@Composable
fun ShiftTimerApp() {
    var currentTime by remember { mutableStateOf(LocalTime.now()) }
    var loginTime by remember { mutableStateOf(LocalTime.of(22, 42)) }
    var shiftHours by remember { mutableStateOf("7") }
    val breaks = remember { mutableStateListOf<Int>() }
    var showResults by remember { mutableStateOf(false) }

    // Update clock every second
    LaunchedEffect(Unit) {
        while (true) {
            currentTime = LocalTime.now()
            delay(1000)
        }
    }

    // Color Palette
    val bgGradient = Brush.radialGradient(
        colors = listOf(Color(0xFF1E3A8A), Color(0xFF0F172A)),
        center = androidx.compose.ui.geometry.Offset(0f, 0f),
        radius = 2000f
    )
    val yellowGradient = Brush.linearGradient(listOf(Color(0xFFFBBF24), Color(0xFFF59E0B)))
    val greenGradient = Brush.linearGradient(listOf(Color(0xFF10B981), Color(0xFF059669)))
    val redGradient = Brush.linearGradient(listOf(Color(0xFFEF4444), Color(0xFFDC2626)))

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgGradient)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
                .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(24.dp)),
            shape = RoundedCornerShape(24.dp),
            color = Color.White.copy(alpha = 0.05f),
            tonalElevation = 8.dp
        ) {
            LazyColumn(
                modifier = Modifier
                    .padding(24.dp)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Text(
                        text = "Shift Timer",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFDE68A),
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "Current Time: ${currentTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"))}",
                        color = Color.White.copy(alpha = 0.4f),
                        fontSize = 14.sp
                    )
                }

                // Login Time Picker
                item {
                    val context = LocalContext.current
                    Label("Login Time")
                    Button(
                        onClick = {
                            TimePickerDialog(context, { _, h, m ->
                                loginTime = LocalTime.of(h, m)
                                showResults = true
                            }, loginTime.hour, loginTime.minute, true).show()
                        },
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.1f))
                    ) {
                        Text(loginTime.format(DateTimeFormatter.ofPattern("HH:mm")), fontSize = 18.sp, color = Color.White)
                    }
                }

                // Shift Hours
                item {
                    Label("Shift Hours")
                    OutlinedTextField(
                        value = shiftHours,
                        onValueChange = { shiftHours = it; showResults = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = TextFieldDefaults.colors(
                            unfocusedContainerColor = Color.White.copy(alpha = 0.1f),
                            focusedContainerColor = Color.White.copy(alpha = 0.15f),
                            unfocusedTextColor = Color.White,
                            focusedTextColor = Color.White
                        ),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )
                }

                // Breaks List
                item { Label("Breaks (minutes)") }
                
                itemsIndexed(breaks) { index, minutes ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = if (minutes == 0) "" else minutes.toString(),
                            onValueChange = { val v = it.toIntOrNull() ?: 0; breaks[index] = v; showResults = true },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(16.dp),
                            placeholder = { Text("Min", color = Color.White.copy(0.3f)) },
                            colors = TextFieldDefaults.colors(
                                unfocusedContainerColor = Color.White.copy(alpha = 0.1f),
                                focusedContainerColor = Color.White.copy(alpha = 0.15f),
                                unfocusedTextColor = Color.White,
                                focusedTextColor = Color.White
                            ),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )
                        IconButton(
                            onClick = { breaks.removeAt(index) },
                            modifier = Modifier
                                .size(56.dp)
                                .background(redGradient, RoundedCornerShape(16.dp))
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Remove", tint = Color.White)
                        }
                    }
                }

                item {
                    Button(
                        onClick = { breaks.add(0) },
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        contentPadding = PaddingValues()
                    ) {
                        Box(
                            modifier = Modifier.fillMaxSize().background(greenGradient),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Add, "Add", tint = Color.White)
                                Spacer(Modifier.width(8.dp))
                                Text("Add Break", fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                }

                item {
                    Button(
                        onClick = { showResults = true },
                        modifier = Modifier.fillMaxWidth().height(64.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        contentPadding = PaddingValues()
                    ) {
                        Box(
                            modifier = Modifier.fillMaxSize().background(yellowGradient),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("Calculate", fontWeight = FontWeight.ExtraBold, color = Color.Black, fontSize = 18.sp)
                        }
                    }
                }

                // Results Section
                if (showResults) {
                    item {
                        val hours = shiftHours.toFloatOrNull() ?: 0f
                        val totalMinutes = (hours * 60).toLong() + breaks.sum()
                        
                        // Smart Start Date Logic
                        var startDateTime = java.time.LocalDateTime.now()
                            .withHour(loginTime.hour)
                            .withMinute(loginTime.minute)
                            .withSecond(0)
                        
                        val now = java.time.LocalDateTime.now()
                        if (java.time.Duration.between(now, startDateTime).toHours() > 12) {
                            startDateTime = startDateTime.minusDays(1)
                        }

                        val logoutTime = startDateTime.plusMinutes(totalMinutes)
                        val diff = java.time.Duration.between(now, logoutTime)
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Logout Time: ${logoutTime.format(DateTimeFormatter.ofPattern("HH:mm"))}",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            
                            val isOvertime = diff.isNegative
                            val absDiff = diff.abs()
                            val h = absDiff.toHours()
                            val m = absDiff.toMinutes() % 60
                            val s = absDiff.toSeconds() % 60
                            
                            Surface(
                                color = if (isOvertime) Color(0xFFEF4444).copy(0.2f) else Color(0xFF10B981).copy(0.2f),
                                border = borderStroke(1.dp, if (isOvertime) Color(0xFFEF4444).copy(0.3f) else Color(0xFF10B981).copy(0.3f)),
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = if (isOvertime) "Shift Ended! (OT: ${h}h ${m}m ${s}s)" 
                                           else "Time Left: ${h}h ${m}m ${s}s",
                                    color = if (isOvertime) Color(0xFFFCA5A5) else Color(0xFF6EE7B7),
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(16.dp),
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Label(text: String) {
    Text(
        text = text.uppercase(),
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color.White.copy(alpha = 0.5f),
        modifier = Modifier.fillMaxWidth().padding(start = 4.dp, bottom = 4.dp),
        textAlign = TextAlign.Start,
        letterSpacing = 1.sp
    )
}

fun borderStroke(width: androidx.compose.ui.unit.Dp, color: Color) = 
    androidx.compose.foundation.BorderStroke(width, color)
