namespace MusicPlayerApp;

public partial class Form1 : Form
{
    private readonly System.Windows.Media.MediaPlayer player = new();
    private readonly List<SongItem> playlist = [];
    private readonly List<LyricLine> lyrics = [];
    private readonly System.Windows.Forms.Timer uiTimer = new() { Interval = 250 };

    private readonly ListBox playlistBox = new();
    private readonly ListBox lyricBox = new();
    private readonly Label titleLabel = new();
    private readonly Label artistLabel = new();
    private readonly Label timeLabel = new();
    private readonly TrackBar progressBar = new();
    private readonly TrackBar volumeBar = new();
    private readonly Button openButton = new();
    private readonly Button lyricButton = new();
    private readonly Button previousButton = new();
    private readonly Button playPauseButton = new();
    private readonly Button stopButton = new();
    private readonly Button nextButton = new();
    private readonly CheckBox autoLyricCheck = new();

    private bool isPlaying;
    private bool isDraggingProgress;
    private int currentIndex = -1;
    private int highlightedLyricIndex = -1;

    public Form1()
    {
        InitializeComponent();
        BuildInterface();
        WireEvents();
    }

    private void BuildInterface()
    {
        Font = new Font("Segoe UI", 10F);
        BackColor = Color.FromArgb(245, 247, 250);
        Padding = new Padding(16);

        var root = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 2,
        };
        root.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 62));
        root.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 38));
        root.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        root.RowStyles.Add(new RowStyle(SizeType.Absolute, 132));

        var playerPanel = CreatePanel();
        var playerLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            RowCount = 4,
            ColumnCount = 1,
            Padding = new Padding(24),
        };
        playerLayout.RowStyles.Add(new RowStyle(SizeType.Absolute, 116));
        playerLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        playerLayout.RowStyles.Add(new RowStyle(SizeType.Absolute, 42));
        playerLayout.RowStyles.Add(new RowStyle(SizeType.Absolute, 60));

        titleLabel.Text = "재생할 음악을 추가하세요";
        titleLabel.Font = new Font("Segoe UI", 22F, FontStyle.Bold);
        titleLabel.ForeColor = Color.FromArgb(24, 32, 44);
        titleLabel.Dock = DockStyle.Fill;
        titleLabel.TextAlign = ContentAlignment.BottomLeft;

        artistLabel.Text = "MP3, WAV, WMA, M4A 파일을 지원합니다";
        artistLabel.Font = new Font("Segoe UI", 10.5F);
        artistLabel.ForeColor = Color.FromArgb(92, 102, 118);
        artistLabel.Dock = DockStyle.Top;

        var nowPlaying = new TableLayoutPanel { Dock = DockStyle.Fill, RowCount = 2 };
        nowPlaying.RowStyles.Add(new RowStyle(SizeType.Percent, 70));
        nowPlaying.RowStyles.Add(new RowStyle(SizeType.Percent, 30));
        nowPlaying.Controls.Add(titleLabel, 0, 0);
        nowPlaying.Controls.Add(artistLabel, 0, 1);

        lyricBox.Dock = DockStyle.Fill;
        lyricBox.BorderStyle = BorderStyle.None;
        lyricBox.Font = new Font("Malgun Gothic", 15F);
        lyricBox.BackColor = Color.White;
        lyricBox.ForeColor = Color.FromArgb(36, 42, 54);
        lyricBox.HorizontalScrollbar = true;

        progressBar.Dock = DockStyle.Fill;
        progressBar.TickStyle = TickStyle.None;
        progressBar.Maximum = 1000;

        var controls = new FlowLayoutPanel
        {
            Dock = DockStyle.Fill,
            FlowDirection = FlowDirection.LeftToRight,
            WrapContents = false,
            AutoScroll = true,
        };

        ConfigureButton(previousButton, "⏮", 54);
        ConfigureButton(playPauseButton, "▶", 66);
        ConfigureButton(stopButton, "■", 54);
        ConfigureButton(nextButton, "⏭", 54);
        ConfigureButton(openButton, "음악 추가", 110);
        ConfigureButton(lyricButton, "가사 열기", 110);

        timeLabel.Text = "00:00 / 00:00";
        timeLabel.AutoSize = false;
        timeLabel.Width = 120;
        timeLabel.TextAlign = ContentAlignment.MiddleCenter;
        timeLabel.ForeColor = Color.FromArgb(70, 80, 96);

        volumeBar.Minimum = 0;
        volumeBar.Maximum = 100;
        volumeBar.Value = 70;
        volumeBar.TickStyle = TickStyle.None;
        volumeBar.Width = 130;
        player.Volume = 0.7;

        autoLyricCheck.Text = "같은 이름 가사 자동";
        autoLyricCheck.Checked = true;
        autoLyricCheck.AutoSize = true;
        autoLyricCheck.Padding = new Padding(8, 12, 0, 0);

        controls.Controls.AddRange([
            previousButton,
            playPauseButton,
            stopButton,
            nextButton,
            openButton,
            lyricButton,
            timeLabel,
            new Label { Text = "Volume", AutoSize = true, Padding = new Padding(10, 12, 0, 0), ForeColor = Color.FromArgb(70, 80, 96) },
            volumeBar,
            autoLyricCheck
        ]);

        playerLayout.Controls.Add(nowPlaying, 0, 0);
        playerLayout.Controls.Add(lyricBox, 0, 1);
        playerLayout.Controls.Add(progressBar, 0, 2);
        playerLayout.Controls.Add(controls, 0, 3);
        playerPanel.Controls.Add(playerLayout);

        var listPanel = CreatePanel();
        var listLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            RowCount = 2,
            Padding = new Padding(18),
        };
        listLayout.RowStyles.Add(new RowStyle(SizeType.Absolute, 48));
        listLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        var listTitle = new Label
        {
            Text = "노래 목록",
            Dock = DockStyle.Fill,
            Font = new Font("Segoe UI", 16F, FontStyle.Bold),
            ForeColor = Color.FromArgb(24, 32, 44),
            TextAlign = ContentAlignment.MiddleLeft,
        };

        playlistBox.Dock = DockStyle.Fill;
        playlistBox.BorderStyle = BorderStyle.None;
        playlistBox.Font = new Font("Malgun Gothic", 11F);
        playlistBox.BackColor = Color.White;
        playlistBox.ForeColor = Color.FromArgb(36, 42, 54);
        playlistBox.HorizontalScrollbar = true;

        listLayout.Controls.Add(listTitle, 0, 0);
        listLayout.Controls.Add(playlistBox, 0, 1);
        listPanel.Controls.Add(listLayout);

        var footer = new Label
        {
            Dock = DockStyle.Fill,
            Text = "음악 파일을 추가한 뒤 목록에서 더블클릭하면 재생됩니다. LRC 파일은 시간에 맞춰 가사를 따라갑니다.",
            ForeColor = Color.FromArgb(92, 102, 118),
            TextAlign = ContentAlignment.MiddleLeft,
            Padding = new Padding(8, 0, 0, 0),
        };

        root.Controls.Add(playerPanel, 0, 0);
        root.Controls.Add(listPanel, 1, 0);
        root.SetColumnSpan(footer, 2);
        root.Controls.Add(footer, 0, 1);

        Controls.Add(root);
    }

    private static Panel CreatePanel()
    {
        return new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.White,
            Margin = new Padding(8),
            Padding = new Padding(1),
        };
    }

    private static void ConfigureButton(Button button, string text, int width)
    {
        button.Text = text;
        button.Width = width;
        button.Height = 42;
        button.Margin = new Padding(4, 8, 4, 4);
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderColor = Color.FromArgb(210, 216, 226);
        button.BackColor = Color.FromArgb(250, 251, 253);
        button.ForeColor = Color.FromArgb(24, 32, 44);
        button.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
    }

    private void WireEvents()
    {
        openButton.Click += (_, _) => AddSongs();
        lyricButton.Click += (_, _) => OpenLyrics();
        playPauseButton.Click += (_, _) => TogglePlayPause();
        stopButton.Click += (_, _) => StopPlayback();
        previousButton.Click += (_, _) => PlayRelative(-1);
        nextButton.Click += (_, _) => PlayRelative(1);
        playlistBox.DoubleClick += (_, _) => PlaySelectedSong();
        volumeBar.ValueChanged += (_, _) => player.Volume = volumeBar.Value / 100.0;
        uiTimer.Tick += (_, _) => UpdatePlaybackUi();
        player.MediaEnded += (_, _) => BeginInvoke((Action)(() => PlayRelative(1)));

        progressBar.MouseDown += (_, _) => isDraggingProgress = true;
        progressBar.MouseUp += (_, _) =>
        {
            isDraggingProgress = false;
            SeekToProgress();
        };
    }

    private void AddSongs()
    {
        using var dialog = new OpenFileDialog
        {
            Title = "음악 파일 선택",
            Filter = "Audio Files|*.mp3;*.wav;*.wma;*.m4a;*.aac|All Files|*.*",
            Multiselect = true,
        };

        if (dialog.ShowDialog(this) != DialogResult.OK)
        {
            return;
        }

        foreach (var path in dialog.FileNames)
        {
            if (playlist.Any(song => string.Equals(song.Path, path, StringComparison.OrdinalIgnoreCase)))
            {
                continue;
            }

            var item = new SongItem(path);
            playlist.Add(item);
            playlistBox.Items.Add(item);
        }

        if (currentIndex == -1 && playlist.Count > 0)
        {
            playlistBox.SelectedIndex = 0;
            LoadSong(0, playImmediately: false);
        }
    }

    private void OpenLyrics()
    {
        using var dialog = new OpenFileDialog
        {
            Title = "가사 파일 선택",
            Filter = "Lyrics|*.lrc;*.txt|All Files|*.*",
        };

        if (dialog.ShowDialog(this) == DialogResult.OK)
        {
            LoadLyrics(dialog.FileName);
        }
    }

    private void PlaySelectedSong()
    {
        if (playlistBox.SelectedIndex >= 0)
        {
            LoadSong(playlistBox.SelectedIndex, playImmediately: true);
        }
    }

    private void TogglePlayPause()
    {
        if (currentIndex == -1 && playlist.Count > 0)
        {
            LoadSong(playlistBox.SelectedIndex >= 0 ? playlistBox.SelectedIndex : 0, playImmediately: true);
            return;
        }

        if (currentIndex == -1)
        {
            AddSongs();
            return;
        }

        if (isPlaying)
        {
            player.Pause();
            isPlaying = false;
            playPauseButton.Text = "▶";
            uiTimer.Stop();
        }
        else
        {
            player.Play();
            isPlaying = true;
            playPauseButton.Text = "⏸";
            uiTimer.Start();
        }
    }

    private void StopPlayback()
    {
        player.Stop();
        isPlaying = false;
        playPauseButton.Text = "▶";
        progressBar.Value = 0;
        timeLabel.Text = "00:00 / " + FormatTime(player.NaturalDuration.HasTimeSpan ? player.NaturalDuration.TimeSpan : TimeSpan.Zero);
        uiTimer.Stop();
        HighlightLyric(-1);
    }

    private void PlayRelative(int offset)
    {
        if (playlist.Count == 0)
        {
            return;
        }

        var nextIndex = currentIndex == -1 ? 0 : (currentIndex + offset + playlist.Count) % playlist.Count;
        LoadSong(nextIndex, playImmediately: true);
    }

    private void LoadSong(int index, bool playImmediately)
    {
        if (index < 0 || index >= playlist.Count)
        {
            return;
        }

        currentIndex = index;
        playlistBox.SelectedIndex = index;

        var song = playlist[index];
        player.Open(new Uri(song.Path));
        titleLabel.Text = song.Title;
        artistLabel.Text = song.Path;
        progressBar.Value = 0;
        highlightedLyricIndex = -1;

        if (autoLyricCheck.Checked)
        {
            var lyricPath = FindMatchingLyric(song.Path);
            if (lyricPath is not null)
            {
                LoadLyrics(lyricPath);
            }
            else
            {
                ShowPlainLyrics(["가사 파일이 없습니다.", "같은 폴더에 같은 파일명의 .lrc 또는 .txt를 두면 자동으로 표시됩니다."]);
            }
        }

        if (playImmediately)
        {
            player.Play();
            isPlaying = true;
            playPauseButton.Text = "⏸";
            uiTimer.Start();
        }
        else
        {
            isPlaying = false;
            playPauseButton.Text = "▶";
        }
    }

    private static string? FindMatchingLyric(string audioPath)
    {
        var directory = Path.GetDirectoryName(audioPath);
        var name = Path.GetFileNameWithoutExtension(audioPath);

        if (directory is null)
        {
            return null;
        }

        var lrcPath = Path.Combine(directory, name + ".lrc");
        if (File.Exists(lrcPath))
        {
            return lrcPath;
        }

        var txtPath = Path.Combine(directory, name + ".txt");
        return File.Exists(txtPath) ? txtPath : null;
    }

    private void LoadLyrics(string path)
    {
        lyrics.Clear();
        highlightedLyricIndex = -1;

        var lines = File.ReadAllLines(path);
        foreach (var line in lines)
        {
            var parsed = LyricLine.Parse(line);
            if (parsed.Count == 0)
            {
                lyrics.Add(new LyricLine(null, line));
            }
            else
            {
                lyrics.AddRange(parsed);
            }
        }

        lyrics.Sort((left, right) =>
        {
            if (left.Time is null && right.Time is null)
            {
                return 0;
            }

            if (left.Time is null)
            {
                return 1;
            }

            if (right.Time is null)
            {
                return -1;
            }

            return left.Time.Value.CompareTo(right.Time.Value);
        });

        ShowLyrics();
    }

    private void ShowPlainLyrics(IEnumerable<string> lines)
    {
        lyrics.Clear();
        lyrics.AddRange(lines.Select(line => new LyricLine(null, line)));
        ShowLyrics();
    }

    private void ShowLyrics()
    {
        lyricBox.Items.Clear();
        foreach (var lyric in lyrics)
        {
            lyricBox.Items.Add(lyric.Text);
        }
    }

    private void UpdatePlaybackUi()
    {
        if (player.Source is null)
        {
            return;
        }

        var duration = player.NaturalDuration.HasTimeSpan ? player.NaturalDuration.TimeSpan : TimeSpan.Zero;
        var position = player.Position;

        if (!isDraggingProgress && duration.TotalMilliseconds > 0)
        {
            var value = (int)Math.Clamp(position.TotalMilliseconds / duration.TotalMilliseconds * progressBar.Maximum, 0, progressBar.Maximum);
            progressBar.Value = value;
        }

        timeLabel.Text = $"{FormatTime(position)} / {FormatTime(duration)}";
        SyncLyrics(position);
    }

    private void SeekToProgress()
    {
        if (player.NaturalDuration.HasTimeSpan)
        {
            var duration = player.NaturalDuration.TimeSpan;
            player.Position = TimeSpan.FromMilliseconds(duration.TotalMilliseconds * progressBar.Value / progressBar.Maximum);
        }
    }

    private void SyncLyrics(TimeSpan position)
    {
        var timedLyrics = lyrics.Where(line => line.Time is not null).ToList();
        if (timedLyrics.Count == 0)
        {
            return;
        }

        var active = -1;
        for (var index = 0; index < lyrics.Count; index++)
        {
            if (lyrics[index].Time is { } time && time <= position)
            {
                active = index;
            }
        }

        HighlightLyric(active);
    }

    private void HighlightLyric(int index)
    {
        if (highlightedLyricIndex == index)
        {
            return;
        }

        highlightedLyricIndex = index;
        if (index >= 0 && index < lyricBox.Items.Count)
        {
            lyricBox.SelectedIndex = index;
            lyricBox.TopIndex = Math.Max(0, index - 4);
        }
        else
        {
            lyricBox.ClearSelected();
        }
    }

    private static string FormatTime(TimeSpan time)
    {
        return time.TotalHours >= 1
            ? time.ToString(@"h\:mm\:ss")
            : time.ToString(@"mm\:ss");
    }

    protected override void OnFormClosed(FormClosedEventArgs e)
    {
        uiTimer.Stop();
        player.Close();
        base.OnFormClosed(e);
    }

    private sealed record SongItem(string Path)
    {
        public string Title => System.IO.Path.GetFileNameWithoutExtension(Path);

    public override string ToString()
    {
        return Title;
    }
    }

    private sealed record LyricLine(TimeSpan? Time, string Text)
    {
        public static List<LyricLine> Parse(string line)
    {
        var result = new List<LyricLine>();
        var matches = System.Text.RegularExpressions.Regex.Matches(line, @"\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]");

        if (matches.Count == 0)
        {
            return result;
        }

        var text = System.Text.RegularExpressions.Regex.Replace(line, @"\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]", "").Trim();
        foreach (System.Text.RegularExpressions.Match match in matches)
        {
            var minutes = int.Parse(match.Groups[1].Value);
            var seconds = int.Parse(match.Groups[2].Value);
            var fraction = match.Groups[3].Success ? match.Groups[3].Value.PadRight(3, '0') : "0";
            var milliseconds = int.Parse(fraction);
            result.Add(new LyricLine(new TimeSpan(0, 0, minutes, seconds, milliseconds), text));
        }

        return result;
    }
}
}
