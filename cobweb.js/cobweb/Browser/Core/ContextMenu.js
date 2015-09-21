
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
				build: this .getMenu .bind (this),
			});
		},
		getMenu: function (trigger, event)
		{
			var
				activeLayer      = this .getBrowser () .getActiveLayer (),
				currentViewpoint = activeLayer ? activeLayer .getViewpoint () : null,
				currentViewer    = this .getBrowser () .viewer_ .getValue ();

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
						callback: function () { return true; },
					},
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
						this .getBrowser () .getCanvas () .focus ();
					}
					.bind (this, viewer),
				};

				if (viewer === currentViewer)
				   menu [viewer] .className += " context-menu-selected";
			}

		   return menu;
		},
		getViewerName: function (viewer)
		{
			switch (viewer)
			{
				case "EXAMINE":
					return "Examine Viewer";
				case "WALK":
					return "Walk Viewer";
				case "FLY":
					return "Fly Viewer";
				case "PLANE":
					return "Plane Viewer";
				case "NONE":
					return "None Viewer";
			}
		},
	});

	return ContextMenu;
});
