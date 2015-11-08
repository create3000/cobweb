
define ([
	"jquery",
],
function ($)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			if (parseInt (key) == key)
				return target .array [key];

			return target .index [key];
		},
		set: function (target, key, value)
		{
			var X3DExternProtoDeclaration = require ("cobweb/Prototype/X3DExternProtoDeclaration");

			if (value instanceof X3DExternProtoDeclaration)
			{
				target .array [key] = value;
				target .index       = { };

				for (var i = 0; i < target .array .length; ++ i)
				{
					var proto = target .array [i];
					target .index [proto .getName ()] = proto;
				}

				return true;
			}

			return false;
		},
	};

	function ExternProtoDeclarationArray ()
	{
		this .array = [ ];
		this .index = { };

		return new Proxy (this, handler);
	}

	$.extend (ExternProtoDeclarationArray .prototype,
	{
		constructor: ExternProtoDeclarationArray,
		push: function (value)
		{
			var X3DExternProtoDeclaration = require ("cobweb/Prototype/X3DExternProtoDeclaration");

			if (value instanceof X3DExternProtoDeclaration)
			{
				this .index [value .getName ()] = value;
				return this .array .push (value);
			}

			return this .array .length;
		},
	});

	return ExternProtoDeclarationArray;
});
