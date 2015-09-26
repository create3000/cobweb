
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"lib/gettext",
	"lib/jquery-contextMenu/dist/jquery.contextMenu",
],
function ($,
          X3DBaseNode,
          _)
{
	function ContextMenu (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		$("head") .append ('<style>.cobweb-menu-title:before { content: "' + _("Cobweb X3D Browser") + '" }</style>');
	}

	ContextMenu .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: ContextMenu,
		getTypeName: function ()
		{
			return "ContextMenu";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "contextMenu";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			$.contextMenu ({
				selector: '.cobweb-surface', 
				build: this .build .bind (this),
			});
		},
		build: function (trigger, event)
		{
			var
				activeLayer      = this .getBrowser () .getActiveLayer (),
				currentViewpoint = activeLayer ? activeLayer .getViewpoint () : null,
				currentViewer    = this .getBrowser () .viewer_ .getValue (),
				lookat           = this .getLookAtViewer ();

			var menu = {
				className: 'cobweb-menu-title',
				items: {
					"separator0": "--------",
					"viewpoints": {
						name: _("Viewpoints"),
						className: "context-menu-icon cobweb-icon-viewpoint",
						items: this .getViewpoints (),
						callback: function (viewpoint)
						{
						   if (! viewpoint)
						      return;

							this .getBrowser () .bindViewpoint (viewpoint);
							this .getBrowser () .getCanvas () .focus ();
						}
						.bind (this, currentViewpoint),
					},
					"separator1": "--------",
					"viewer": {
						name: _(this .getViewerName (currentViewer)),
						className: "context-menu-icon cobweb-icon-" + currentViewer .toLowerCase () + "-viewer",
						callback: function (viewer)
						{
							this .getBrowser () .viewer_ = viewer;
							this .getBrowser () .getNotification () .string_ = _(this .getViewerName (viewer));
							this .getBrowser () .getCanvas () .focus ();
						}
						.bind (this, currentViewer),
					},
					"available-viewer": {
						name: _("Available Viewers"),
						items: this .getAvailableViewers (),
					},
					"lookat": {
						name: _("Look At"),
						className: "context-menu-icon cobweb-icon-zoom-in",
					},
					"separator2": "--------",
					//"view": {
						//name: _("View"),
						//items : {
							"primitive-quality": {
								name: _("Primitive Quality"),
								className: "context-menu-icon cobweb-icon-primitive-quality",
								items: {
									"high": {
										name: _("High"),
										type: "radio",
										radio: "primitive-quality",
										selected: this .getBrowser () .getBrowserOption ("PrimitiveQuality") === "HIGH",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("PrimitiveQuality", "HIGH");
												this .getBrowser () .getNotification () .string_ = _("Primitive Quality") + ": " + _("high");
											}
											.bind (this),
										},
									},
									"medium": {
										name: _("Medium"),
										type: "radio",
										radio: "primitive-quality",
										selected: this .getBrowser () .getBrowserOption ("PrimitiveQuality") === "MEDIUM",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("PrimitiveQuality", "MEDIUM");
												this .getBrowser () .getNotification () .string_ = _("Primitive Quality") + ": " + _("medium");
											}
											.bind (this),
										},
									},
									"low": {
										name: _("Low"),
										type: "radio",
										radio: "primitive-quality",
										selected: this .getBrowser () .getBrowserOption ("PrimitiveQuality") === "LOW",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("PrimitiveQuality", "LOW");
												this .getBrowser () .getNotification () .string_ = _("Primitive Quality") + ": " + _("low");
											}
											.bind (this),
										},
									},
								},
							},
							"texture-quality": {
								name: _("Texture Quality"),
								className: "context-menu-icon cobweb-icon-texture-quality",
								items: {
									"high": {
										name: _("High"),
										type: "radio",
										radio: "texture-quality",
										selected: this .getBrowser () .getBrowserOption ("TextureQuality") === "HIGH",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("TextureQuality", "HIGH");
												this .getBrowser () .getNotification () .string_ = _("Texture Quality") + ": " + _("high");
											}
											.bind (this),
										},
									},
									"medium": {
										name: _("Medium"),
										type: "radio",
										radio: "texture-quality",
										selected: this .getBrowser () .getBrowserOption ("TextureQuality") === "MEDIUM",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("TextureQuality", "MEDIUM");
												this .getBrowser () .getNotification () .string_ = _("Texture Quality") + ": " + _("medium");
											}
											.bind (this),
										},
									},
									"low": {
										name: _("Low"),
										type: "radio",
										radio: "texture-quality",
										selected: this .getBrowser () .getBrowserOption ("TextureQuality") === "LOW",
										events: {
											click: function ()
											{
												this .getBrowser () .setBrowserOption ("TextureQuality", "LOW");
												this .getBrowser () .getNotification () .string_ = _("Texture Quality") + ": " + _("low");
											}
											.bind (this),
										},
									},
								},
							},
							"display-rubberband": {
								name: _("Display Rubberband"),
								type: "checkbox",
								selected: this .getBrowser () .getBrowserOption ("Rubberband"),
								events: {
									click: function ()
									{
									   var rubberband = ! this .getBrowser () .getBrowserOption ("Rubberband");

										this .getBrowser () .setBrowserOption ("Rubberband", rubberband);

										if (rubberband)
											this .getBrowser () .getNotification () .string_ = _("Rubberband") + ": " + _("on");
										else
											this .getBrowser () .getNotification () .string_ = _("Rubberband") + ": " + _("off");
									}
									.bind (this),
								},
							},
							"browser-timings": {
								name: _("Browser Timings"),
								type: "checkbox",
								selected: this .getBrowser () .getBrowserTimings () .enabled_ .getValue (),
								events: {
									click: function ()
									{
										this .getBrowser () .getBrowserTimings () .enabled_ = ! this .getBrowser () .getBrowserTimings () .enabled_ .getValue ();
										this .getBrowser () .getCanvas () .focus ();
									}
									.bind (this),
								},
							},
						//},
					//},
					"mute-browser": {
						name: _("Mute Browser"),
						type: "checkbox",
						selected: this .getBrowser () .mute_ .getValue (),
						events: {
							click: function ()
							{
							   var mute = ! this .getBrowser () .mute_ .getValue ();
								this .getBrowser () .mute_ = mute;
								this .getBrowser () .getNotification () .string_ = mute ? _("Browser muted") : _("Browser unmuted");
							}
							.bind (this),
						},
					},
					"separator3": "--------",
					"about": {
						name: _("About Cobweb"),
						className: "context-menu-icon cobweb-icon-help-about",
						callback: function ()
						{
						   window .open ("http://titania.create3000.de/cobweb");
						},
					},
				}
			};

			if ($.isEmptyObject (menu .items .viewpoints .items))
			{
				delete menu .items .separator0;
				delete menu .items .viewpoints;
			}

			if (! lookat)
			   delete menu .items .lookat;

			return menu;
		},
		getViewpoints: function ()
		{
			var activeLayer = this .getBrowser () .getActiveLayer ();

			if (! activeLayer)
				return { };

			var
				viewpoints       = activeLayer .getViewpoints () .get (),
				currentViewpoint = activeLayer .getViewpoint (),
				menu             = { };

			for (var i = 0; i < viewpoints .length; ++ i)
			{
				var
					viewpoint   = viewpoints [i]
					description = viewpoint .description_ .getValue ();

				if (description === "")
				   continue;

				var item = {
					name: description,
					callback: function (viewpoint)
					{
						this .getBrowser () .bindViewpoint (viewpoint);
						this .getBrowser () .getCanvas () .focus ();
					}
					.bind (this, viewpoint),
				};

				if (viewpoint === currentViewpoint)
					item .className = "context-menu-selected";

				menu ["Viewpoint" + viewpoint .getId ()] = item;
			}

			return menu;
		},
		getAvailableViewers: function ()
		{
			var
				currentViewer    = this .getBrowser () .viewer_ .getValue (),
				availableViewers = this .getBrowser () .availableViewers_,
				menu             = { };

			for (var i = 0; i < availableViewers .length; ++ i)
			{
				var viewer = availableViewers [i];

				if (viewer === "LOOKAT")
					continue;
			   
				menu [viewer] = {
					name: _(this .getViewerName (viewer)),
					className: "context-menu-icon cobweb-icon-" + viewer .toLowerCase () + "-viewer",
					callback: function (viewer)
					{
						this .getBrowser () .viewer_ = viewer;
						this .getBrowser () .getNotification () .string_ = _(this .getViewerName (viewer));
						this .getBrowser () .getCanvas () .focus ();
					}
					.bind (this, viewer),
				};

				if (viewer === currentViewer)
				   menu [viewer] .className += " context-menu-selected";
			}

		   return menu;
		},
		getLookAtViewer: function ()
		{
			var availableViewers = this .getBrowser () .availableViewers_;

			for (var i = 0; i < availableViewers .length; ++ i)
			{
				if (availableViewers [i] === "LOOKAT")
					return true;
			}

		   return false;
		},
		getViewerName: function (viewer)
		{
			switch (viewer)
			{
				case "EXAMINE":
					return _("Examine Viewer");
				case "WALK":
					return _("Walk Viewer");
				case "FLY":
					return _("Fly Viewer");
				case "PLANE":
					return _("Plane Viewer");
				case "NONE":
					return _("None Viewer");
			}
		},
	});

	return ContextMenu;
});
