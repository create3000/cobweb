
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"lib/gettext",
	"jquery-mousewheel",
],
function ($, X3DViewer, Vector3, Rotation4, _)
{
"use strict";

	function LookAtViewer (executionContext)
	{
		X3DViewer .call (this, executionContext);

		this .button = -1;
	}

	LookAtViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: LookAtViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			var
			   browser = this .getBrowser (),
			   canvas  = browser .getCanvas ();

			canvas .bind ("mousedown.LookAtViewer",  this .mousedown  .bind (this));
			canvas .bind ("mouseup.LookAtViewer",    this .mouseup    .bind (this));
		},
		mousedown: function (event)
		{
			if (this .button >= 0)
				return;
		
			this .pressTime = performance .now ();

			switch (event .button)
			{
				case 0:
				{
					this .button = event .button;
					
					$(document) .bind ("mouseup.LookAtViewer"   + this .getId (), this .mouseup .bind (this));
		
					event .preventDefault ();
					this .getActiveViewpoint () .transitionStop ();

					break;
				}
			}
		},
		mouseup: function (event)
		{
			if (event .button !== this .button)
				return;

			this .button = -1;
		
			$(document) .unbind (".LookAtViewer" + this .getId ());

			var
				offset = this .getBrowser () .getCanvas () .offset (), 
				x      = event .pageX - offset .left,
				y      = this .getBrowser () .getCanvas () .height () - (event .pageY - offset .top);

			switch (event .button)
			{
				case 0:
				{
					event .preventDefault ();

					this .lookAt (x, y);
					break;
				}
			}
		},
		lookAt: function (x, y)
		{
			if (this .touch (x, y))
			{
				var hit = this .getBrowser () .getNearestHit ();

				this .getActiveViewpoint () .lookAtPoint (hit .intersection .point, 2 - 1.618034);
			}
		},
		touch: function (x, y)
		{
			this .getBrowser () .touch (x, y);
		
			return this .getBrowser () .getHits () .length;
		},
		dispose: function ()
		{
			this .getBrowser () .getCanvas () .unbind (".LookAtViewer");
			$(document) .unbind (".LookAtViewer" + this .getId ());
		},
	});

	return LookAtViewer;
});
