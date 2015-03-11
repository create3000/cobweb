
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DConstants,
          Algorithm)
{
	with (Fields)
	{
		var
			FRAMES         = 180, // Number of frames after wich a level change takes in affect.
			FRAME_RATE_MIN = 20,  // Lowest level of detail.
			FRAME_RATE_MAX = 55;  // Highest level of detail.

		function LOD (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .LOD);

			this .frameRate        = 60;
			this .keepCurrentLevel = false;
		}

		LOD .prototype = $.extend (new X3DGroupingNode (),
		{
			constructor: LOD,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "forceTransitions", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "center",           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "range",            new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "level_changed",    new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "LOD";
			},
			getComponentName: function ()
			{
				return "Navigation";
			},
			getContainerField: function ()
			{
				return "children";
			},
			getLevel: function (type)
			{
				if (this .range_ .length === 0)
				{
					this .frameRate = ((FRAMES - 1) * this .frameRate + this .getBrowser () .currentFrameRate) / FRAMES;

					var size = this .children_ .length;

					if (size < 2)
						return 0;

					if (size === 2)
						return Number (this .frameRate > FRAME_RATE_MAX);

					var n        = size - 1;
					var fraction = Math .max ((this .frameRate - FRAME_RATE_MIN) / (FRAME_RATE_MAX - FRAME_RATE_MIN), 0);

					return Math .min (Math .ceil (fraction * (n - 1)), n);
				}

				var distance = this .getDistance (type);

				return Algorithm .upperBound (this .range_, 0, this .range_ .length, distance);
			},
			getDistance: function (type)
			{
				var modelViewMatrix = this .getModelViewMatrix (type);

				modelViewMatrix .translate (this .center_ .getValue ());

				return modelViewMatrix .origin .abs ();
			},
			traverse: function (type)
			{
				if (! this .keepCurrentLevel)
				{
					var level        = this .getLevel (type);
					var currentLevel = this .level_changed_ .getValue ();

					if (level !== currentLevel)
					{
						if (this .forceTransitions_ .getValue ())
						{
							if (type === TraverseType .DISPLAY)
							{
								if (level > currentLevel)
									this .level_changed_ = currentLevel + 1;
								else
									this .level_changed_ = currentLevel - 1;
							}
						}
						else
							this .level_changed_ = level;
					}
				}

				var level = this .level_changed_ .getValue ();

				if (level < this .children_ .length)
				{
					var child = this .children_ [level];

					if (child)
						child .getValue () .traverse (type);
				}
			},
		});

		return LOD;
	}
});

